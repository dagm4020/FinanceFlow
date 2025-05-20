// controllers/challengeController.js
const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const config = require('../config/config');
const db = require('../config/dbConfig');

const LOOKBACK_DAYS = 30;   // first pass window
const FALLBACK_TXN_COUNT = 14;   // use this many if the window is empty
// Generate Weekly Challenges
const generateWeeklyChallenge = asyncHandler(async (req, res) => {
  const { userID } = req.user;

  if (!userID) {
    return res.status(400).json({ error: 'userID is required' });
  }

  try {
    const [existingChallenges] = await db.execute(
      'SELECT description FROM Challenges WHERE userID = ? AND isCompleted = 0',
      [userID]
    );
    const existingDescriptions = new Set(existingChallenges.map((c) => c.description.toLowerCase()));

    const MAX_CHALLENGES = 20;
    const CHALLENGES_PER_CLICK = 5;
    const currentCount = existingChallenges.length;
    const availableSlots = Math.min(MAX_CHALLENGES - currentCount, CHALLENGES_PER_CLICK);
    if (availableSlots <= 0) {
      return res.status(400).json({ error: 'You already have the maximum of 20 active challenges.' });
    }

    const since = new Date();
    since.setDate(since.getDate() - LOOKBACK_DAYS);
    const isoSince = since.toISOString().split('T')[0];

    let [transactions] = await db.execute(
      `SELECT description, amount, date
      FROM Transactions t
      INNER JOIN BankAccounts b ON t.accountID = b.id
      WHERE b.userID = ? AND t.date >= ?
      ORDER BY t.date DESC`,
      [userID, isoSince]
    );

    /* ---------- 2. fallback to “latest N” if window is empty ---------- */
    if (transactions.length === 0) {
      [transactions] = await db.execute(
        `SELECT description, amount, date
      FROM Transactions t
      INNER JOIN BankAccounts b ON t.accountID = b.id
      WHERE b.userID = ?
              ORDER BY t.date DESC
              LIMIT ?`,
        [userID, FALLBACK_TXN_COUNT]
      );
    }

    /* ---------- 3. still nothing? bail out gracefully ---------- */
    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ message: 'No transactions found to generate challenges.' });
    }

    const transactionHistory = transactions
      .map((tx) => `${tx.description}: $${parseFloat(tx.amount).toFixed(2)}`)
      .join(', ');




    const totalExpenses = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalIncome = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const combinedTotal = totalIncome - totalExpenses;

    const prompt = `Based on the following transaction history over the past week: ${transactionHistory}, and the total expenses: $${totalExpenses.toFixed(
      2
    )}, total income: $${totalIncome.toFixed(2)}, and net total: $${combinedTotal.toFixed(
      2
    )}, provide exactly ${availableSlots} personalized financial challenges for the user this week. Format as a numbered list.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful financial assistant providing personalized financial challenges based on the user's transaction history and financial metrics.",
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
      }
    );

    const aiChallenges = response.data.choices[0].message.content.trim();
    const challengeList = aiChallenges.split('\n').filter((line) => line.trim() !== '');
    const challenges = challengeList.map((ct) => {
      const match = ct.match(/^\d+\.\s+(.*)/);
      return match ? match[1].trim() : ct.trim();
    });

    const uniqueChallenges = challenges.filter((desc) => !existingDescriptions.has(desc.toLowerCase()));
    if (uniqueChallenges.length === 0) {
      return res.status(200).json({ message: 'No new unique challenges generated.' });
    }

    const insertQuery = 'INSERT INTO Challenges (userID, description, isCompleted) VALUES (?, ?, 0)';
    const toInsert = uniqueChallenges.slice(0, availableSlots);
    for (const desc of toInsert) {
      await db.execute(insertQuery, [userID, desc]);
    }

    const [newChallenges] = await db.execute(
      `SELECT * FROM Challenges WHERE userID = ? AND isCompleted = 0 ORDER BY createdAt DESC LIMIT ${availableSlots}`,
      [userID]
    );

    return res.status(201).json({ challenges: newChallenges });
  } catch (error) {
    console.error('Error generating weekly challenges:', error?.response?.data || error.message || error);
    return res.status(500).json({ error: 'Failed to generate weekly challenges. Please try again later.' });
  }
});

const getUserChallenges = asyncHandler(async (req, res) => {
  const { userID } = req.user;
  if (!userID) return res.status(400).json({ error: 'userID is required' });

  try {
    const query = 'SELECT * FROM Challenges WHERE userID = ? ORDER BY createdAt DESC LIMIT 20';
    const [challenges] = await db.execute(query, [userID]);
    return res.status(200).json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return res.status(500).json({ error: 'Server error fetching challenges' });
  }
});

const completeChallenge = asyncHandler(async (req, res) => {
  const { userID } = req.user;
  const { challengeID } = req.params;
  if (!userID || !challengeID) return res.status(400).json({ error: 'userID and challengeID are required' });

  try {
    const query = 'DELETE FROM Challenges WHERE challengeID = ? AND userID = ?';
    const [result] = await db.execute(query, [challengeID, userID]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Challenge not found or not authorized' });
    }
    return res.status(200).json({ message: 'Challenge marked as completed' });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return res.status(500).json({ error: 'Server error completing challenge' });
  }
});

const deleteAllChallenges = asyncHandler(async (req, res) => {
  const { userID } = req.user;
  if (!userID) return res.status(400).json({ error: 'userID is required' });

  try {
    const query = 'DELETE FROM Challenges WHERE userID = ?';
    await db.execute(query, [userID]);
    return res.status(200).json({ message: 'All challenges deleted successfully' });
  } catch (error) {
    console.error('Error deleting all challenges:', error);
    return res.status(500).json({ error: 'Server error deleting challenges' });
  }
});

module.exports = { generateWeeklyChallenge, getUserChallenges, completeChallenge, deleteAllChallenges };
