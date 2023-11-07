document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('wordInput');
    const searchButton = document.getElementById('searchButton');
    const definition = document.getElementById('definition');
    const examples = document.getElementById('examples');
    const languageSelect = document.getElementById('languageSelect');

    // Replace 'YOUR_API_KEY' with your actual OpenAI API key
    const apiKey = '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';

    searchButton.addEventListener('click', () => {
        const word = wordInput.value;
        const language = languageSelect.value;
        if (word) {
            getDefinition(word, language);
        }
    });

    function getDefinition(word, language) {
        fetchDefinition(word, language)
            .then(response => {
                const content = response.choices[0].message.content;
                definition.innerHTML = `<b>Definition:</b> ${content}`;

                // Extract and format examples
                const examplesContent = extractExamples(response.choices[1].message.content);
                examples.innerHTML = `<h3 class="highlight"><b>Examples:</b></h3><p>${examplesContent}</p>`;
            })
            .catch(error => {
                console.error(error);
            });
    }

    function fetchDefinition(word, language) {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful dictionary in ${language}.`
                    },
                    {
                        role: 'user',
                        content: `Define "${word}"`
                    },
                    // Ask for examples in a separate message
                    {
                        role: 'assistant',
                        content: 'Provide examples.'
                    }
                ]
            })
        })
        .then(response => response.json());
    }

    function extractExamples(responseContent) {
        const exampleMatches = responseContent.match(/\d\.(.*?)(?=(\d\.|\Z))/gs);
        if (exampleMatches) {
            return exampleMatches.join('<br>');
        }
        return 'No examples found.';
    }
});
