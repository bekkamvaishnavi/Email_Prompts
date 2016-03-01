import React from 'react';
import EmailPromptModal from './components/EmailPrompt';

/*  All of the below code belongs in the home.vm that will render this component for a user if needed */

/*  Finally, render the component passing it configs (that contain the strings) */
React.render(<EmailPromptModal config={emailPromptConfig} visible={true}/>, document.getElementById('emailPrompt'));