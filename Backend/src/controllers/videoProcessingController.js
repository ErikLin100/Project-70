const { transcribeAudio } = require('../services/openaiService');

exports.processVideo = async (req, res) => {
  const { audioFilePath } = req.body;

  try {
    const transcriptionResult = await transcribeAudio(audioFilePath);
    if (transcriptionResult) {
      console.log('Transcription Result:', transcriptionResult);
      // You can add additional logic here to process the segments and timestamps
      // and generate video clips or perform any other necessary operations
    } else {
      console.error('Error: Transcription result is null');
    }

    console.log('Audio processing completed successfully');
    res.status(200).json({ message: 'Audio processing completed successfully' });
  } catch (error) {
    console.error('Error during audio processing:', error);
    res.status(500).json({ error: 'Error during audio processing' });
  }
};