// controllers/requestController.js

export const createAssistanceRequest = async (req, res) => {
  try {
    const { needType, description, representation, location, phone } = req.body;

    // Basic validation
    if (!needType || (Array.isArray(needType) && needType.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one type of assistance needed.'
      });
    }

    if (!description || !location || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Description, location, and phone number are required.'
      });
    }

    // Process/save your data (e.g., MongoDB/Database query)
    const newRequest = {
      id: Date.now(),
      needType: Array.isArray(needType) ? needType : [needType],
      description,
      representation: representation || 'Myself',
      location,
      phone,
      createdAt: new Date()
    };

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Assistance request submitted successfully.',
      data: newRequest
    });

  } catch (error) {
    console.error('Error creating assistance request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing your request.'
    });
  }
};