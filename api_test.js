const OpenAI = require('openai');

async function main() {
  const openai = new OpenAI({
    apiKey: '',
  });

  try {
    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say this is a test.' }],
    });

    console.log('Response from OpenAI:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error calling OpenAI API:');
    console.error(error);
  }
}

main();
