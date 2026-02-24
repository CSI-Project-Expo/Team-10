const axios = require('axios');

// Sends code to the judge microservice
async function judgeCode({ code, language, testCases }) {
  try {
    const judgeUrl = process.env.JUDGE_URL || 'http://localhost:8000/judge';
    const response = await axios.post(judgeUrl, { code, language, testCases });
    return response.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error('Judge service error: ' + message);
  }
}

module.exports = { judgeCode };
