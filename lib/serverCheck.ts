const flaskServerUrl = process.env.FLASK_SERVER_URL || 'http://localhost:5000';

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${flaskServerUrl}/health`);
    if (response.ok) {
      const data = await response.json();
      return data.status === 'healthy';
    }
    return false;
  } catch (error) {
    console.error('Error checking server health:', error);
    return false;
  }
}