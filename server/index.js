import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for leaderboard (resets on server restart)
const leaderboard = [];

// Initialize X Client
const xClient = process.env.X_BEARER_TOKEN
    ? new TwitterApi(process.env.X_BEARER_TOKEN)
    : null;

// Mock fallback logic
const getMockXScore = (handle) => {
    let score = 0;
    for (let i = 0; i < handle.length; i++) {
        score += handle.charCodeAt(i);
    }
    return (score % 10) + 1;
};

// Calculate score based on user metrics
const calculateRealScore = (user) => {
    const { public_metrics } = user;
    if (!public_metrics) return 2;

    const followers = public_metrics.followers_count || 0;
    const following = public_metrics.following_count || 0;
    const tweets = public_metrics.tweet_count || 0;
    const ratio = following > 0 ? followers / following : 0;

    let score = 0;
    if (tweets > 50) score += 2;
    if (followers > 1000) score += 3;
    if (followers > 10000) score += 2;
    if (ratio > 2) score += 2;
    if (ratio > 10) score += 1;
    if (tweets > 5000) score += 2;

    return Math.min(Math.floor(score), 10);
};

// Routes
app.get('/', (req, res) => {
    res.send('ETHMumbai Maxi Checker API is running');
});

// GET Leaderboard
app.get('/api/leaderboard', (req, res) => {
    // Sort by score (descending) and take top 50
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 50);
    res.json(sorted);
});

// POST Calculate Score & Save
app.post('/api/score', async (req, res) => {
    try {
        const { handle } = req.body;

        if (!handle) {
            return res.status(400).json({ error: 'Handle is required' });
        }

        console.log(`Checking score for @${handle}`);

        let resultData = {
            handle,
            verified: true,
            interactionScore: 0,
            memberLevel: "Community Member",
            source: "mock",
        };

        if (!xClient) {
            console.warn("No X_BEARER_TOKEN found using mock.");
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockScore = getMockXScore(handle);
            resultData.interactionScore = mockScore;
            resultData.memberLevel = "Community Member (Mock)";
        } else {
            try {
                const userResult = await xClient.v2.userByUsername(handle, {
                    'user.fields': ['public_metrics', 'protected', 'created_at', 'description', 'profile_image_url']
                });

                if (!userResult.data) {
                    return res.status(404).json({ error: 'User not found on X' });
                }

                const user = userResult.data;
                const score = calculateRealScore(user);

                let level = "Tourist";
                if (score >= 3) level = "Resident";
                if (score >= 6) level = "Activist";
                if (score >= 9) level = "Mayor";

                resultData = {
                    handle: user.username,
                    verified: true,
                    interactionScore: score,
                    memberLevel: level,
                    profileImage: user.profile_image_url ? user.profile_image_url.replace('_normal', '') : null, // High res
                    source: "api_v2",
                    metrics: {
                        followers: user.public_metrics?.followers_count
                    }
                };

            } catch (apiError) {
                if (apiError.code === 401 || (apiError.data && apiError.data.status === 401)) {
                    console.warn("⚠️  [Auth Error] Invalid X_BEARER_TOKEN detected (401). Switching to Mock Mode.");
                } else {
                    console.error("X API Error:", apiError);
                }
                resultData.interactionScore = getMockXScore(handle);
                resultData.memberLevel = "Community Member (Fallback)";
                resultData.source = "mock_fallback";
            }
        }

        // Save to Leaderboard
        const existingIndex = leaderboard.findIndex(u => u.handle.toLowerCase() === resultData.handle.toLowerCase());
        if (existingIndex > -1) {
            // Update if new score is better
            if (resultData.interactionScore > leaderboard[existingIndex].score) {
                leaderboard[existingIndex].score = resultData.interactionScore;
                leaderboard[existingIndex].level = resultData.memberLevel;
                leaderboard[existingIndex].profileImage = resultData.profileImage;
            }
        } else {
            leaderboard.push({
                handle: resultData.handle,
                score: resultData.interactionScore,
                level: resultData.memberLevel,
                profileImage: resultData.profileImage
            });
        }

        res.json(resultData);

    } catch (error) {
        console.error('SERVER ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
