module.exports = async function handler(req, res) {
    // CORS — only allow same origin
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const accessKey = process.env.WEB3FORMS_KEY;
    if (!accessKey) {
        console.error('WEB3FORMS_KEY env variable is not set');
        return res.status(500).json({ success: false, message: 'Server misconfiguration.' });
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                access_key: accessKey,
                name,
                email,
                subject: subject || `Portfolio contact from ${name}`,
                message,
            })
        });

        const data = await response.json();

        if (data.success) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Web3Forms error:', data);
            return res.status(502).json({ success: false, message: data.message || 'Submission failed.' });
        }

    } catch (err) {
        console.error('Contact handler error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};
