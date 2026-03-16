// courseData.ts

// 1. Define specific structures for each content type
export interface VideoData {
    url: string;
}

export interface TheoryData {
    text: string;
    keyTakeaway?: string;
    visualSummaryTitle?: string;
    items?: {
        label: string;
        color: string;
        text: string;
        border: string;
    }[];
}

export interface McqData {
    title: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface CodingData {
    language: 'javascript' | 'python' | 'java';
    title: string;
    question: string;
    instructions: string[];
    snippet: string;
    pdfPath: string;
}

// 2. Discriminated Union
export type ContentBlock =
    | { id: string; type: 'video'; title: string; duration: string; data: VideoData }
    | { id: string; type: 'theory'; title: string; duration: string; data: TheoryData }
    | { id: string; type: 'mcq'; title: string; duration: string; data: McqData }
    | { id: string; type: 'coding'; title: string; duration: string; data: CodingData };

export interface Module {
    id: string;
    title: string;
    description: string;
    duration: string;
    completionPercentage: number;
    content: ContentBlock[];
}

export interface Instructor {
    name: string;
    avatar: string;
    bio: string;
}

// NEW: difficulty field
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    totalCompletion: number;
    instructor: Instructor;
    prerequisites: string[];
    relatedCourses: string[];
    previewVideoUrl: string;
    modules: Module[];
    difficulty: CourseDifficulty; // <- added
}

// 3. Sample Data
export const sampleCourse: Course = {
    id: 'ai-001',
    title: 'Developing AI Systems with the OpenAI API',
    subtitle: 'Build intelligent applications from scratch using cutting-edge language models and API integrations.',
    description: 'Get your AI applications ready for production with this OpenAI API course. You’ll discover best practices for developing applications on the OpenAI API, including moderation and validation, testing, and practices for improved safety.You’ll also learn how to connect your application with external systems and APIs through function calling.This course builds on core OpenAI functionalities introduced in Working with the OpenAI API and prompt writing best practices from Prompt Engineering with the OpenAI API to help you elevate your projects from proof of concept to production- ready systems.',
    totalCompletion: 65,
    instructor: {
        name: 'Francesca Donadoni',
        avatar: 'tutor1.jpg',
        bio: 'AI Curriculum Manager',
    },
    prerequisites: ['Python Toolbox', 'Prompt Engineering with the OpenAI API', 'Working with the OpenAI API'],
    relatedCourses: ['Associate AI Engineer for Developers', 'Developing AI Applications','OpenAI Fundamentals'],
    previewVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    difficulty: 'Advanced', // <- set difficulty here
    modules: [
        {
            id: 'mod-1',
            title: 'Structuring End-to-End Applications',
            description: 'Learn how to seamlessly incorporate the OpenAI API into more complex systems, mastering the art of manipulating the response format and adeptly handling errors. This chapter provides essential knowledge for those looking to build components of AI systems that are not just interactive but also robust and efficient.',
            duration: '45 mins',
            completionPercentage: 77,
            content: [
                {
                    id: 'c1',
                    type: 'video',
                    title: 'Structuring an API call',
                    duration: '04:15',
                    data: { url: 'm1v1.mp4' },
                },
                {
                    id: 'c2',
                    type: 'mcq',
                    title: 'Decoding the response',
                    duration: '10 min',
                    data: {
                        title: 'Decoding the response',
                        question: 'The format of the output response from the Chat Completions endpoint is an object where the message can be accessed by selecting the appropriate fields. In this example, you have just submitted a request to the API to list three Python libraries with the year they were first released, and it has returned a response. For the response shown, what is the correct way to extract the content of the message only?',
                        options: [
                            'response.choices[0].message.content',
                            'response.choices[0]',
                            'response.choices.content.message'
                        ],
                        correctAnswerIndex: 0
                    },
                },
                {
                    id: 'c3',
                    type: 'coding',
                    title: 'Formatting model response as JSON',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Formatting model response as JSON',
                        question: 'As a librarian cataloging new books, you aim to leverage the OpenAI API to automate the creation of a JSON file from text notes you received from a colleague. Your task is to extract relevant information such as book titles and authors and to do this, you use the OpenAI API to convert the text notes, that include book titles and authors, into structured JSON files. In this and all the following exercises, the openai library has already been loaded.Entering your own API key is not necessary to create requests and complete the exercises in this course; however, you may do so if you prefer.',
                        instructions: [
                            "Create an OpenAI API client.",
                            "Create a request to the Chat Completions endpoint.",
                            "Specify that the request should use the json_object response format.",
                            "Extract and print the model response.",
                        ],
                        snippet: '# Create the OpenAI client\nclient = ____(api_key="<OPENAI_API_TOKEN>")\n\n# Create the request\nresponse = ____(\n    model="gpt-4o-mini",\n    messages=[\n        {"role": "user", "content": "I have these notes with book titles and authors: New releases this week! The Beholders by Hester Musson, The Mystery Guest by Nita Prose. Please organize the titles and authors in a json file."}\n    ],\n    # Specify the response format\n    ____\n)\n\n# Print the response\nprint(____)',
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",

                    },
                },
                {
                    id: 'c4',
                    type: 'video',
                    title: 'Handling errors',
                    duration: '03:52',
                    data: { url: 'm1v2.mp4' },
                },
                {
                    id: 'c5',
                    type: 'theory',
                    title: 'Interpreting error messages',
                    duration: '10 min',
                    data: {
                        text: 'Error messages from the OpenAI API can provide insights into what went wrong during your request. Common errors include rate limits, invalid parameters, and authentication issues. Understanding these messages is crucial for debugging and improving your API calls.',
                        visualSummaryTitle: 'ERROR HIERARCHY',
                        items: [
                            {
                                label: '401: AuthenticationError',
                                color: 'bg-red-50',
                                text: 'text-red-700',
                                border: 'border-red-100'
                            },
                            {
                                label: '429: RateLimitError',
                                color: 'bg-orange-50',
                                text: 'text-orange-700',
                                border: 'border-orange-100'
                            },
                            {
                                label: '400: BadRequestError',
                                color: 'bg-gray-50',
                                text: 'text-gray-700',
                                border: 'border-gray-200'
                            }
                        ]
                    }
                },
                {
                    id: 'c6',
                    type: 'coding',
                    title: 'Handling Exceptions',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Handling exceptions',
                        question: 'You are working at a logistics company on developing an application that uses the OpenAI API to check the shipping address of your top three customers. The application will be used internally and you want to make sure that other teams are presented with an easy to read message in case of error. To address this requirement, you decide to print a custom message in case the users fail to provide a valid key for authentication, and use a try and except block to handle that. The message variable has already been imported',
                        instructions: [
                            "Use the try statement to attempt making a request to the API.",
                            "Print the response if the request succeeds.",
                            "Use the except statement to handle the authentication error that may occur.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Use the try statement\n____:\n    response = ____(\n    model=\"gpt-4o-mini\",\n    messages=[message]\n    )\n    # Print the response\n    print(response.____)\n\n# Use the except statement\n____:\n    print(\"Please double check your authentication key and try again, the one provided is not valid.\")",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c7',
                    type: 'video',
                    title: 'Batching',
                    duration: '04:13',
                    data: { url: 'm1v3.mp4' },
                },
                {
                    id: 'c8',
                    type: 'coding',
                    title: 'Avoiding rate limits with retry',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Avoiding rate limits with retry',
                        question: 'You\'ve created a function to run Chat Completions with a custom message but have noticed it sometimes fails due to rate limits.You decide to use the @retry decorator from the tenacity library to avoid errors when possible.',
                        instructions: [
                            "Import the tenacity library with required functions: retry, wait_random_exponential, and stop_after_attempt.",
                            "Create an OpenAI API client.",
                            "Complete the retry decorators with the parameters required to start retrying at an interval of 5 seconds, up to 40 seconds, and to stop after 4 attempts.",
                        ],
                        "snippet": "# Import the tenacity library\nfrom ____ import ____\n\nclient = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Add the appropriate parameters to the decorator\n@retry(____, ____)\ndef get_response(model, message):\n    response = client.chat.completions.create(\n      model=model,\n      messages=[message]\n    )\n    return response.choices[0].message.content\n\nprint(get_response(\"gpt-4o-mini\", {\"role\": \"user\", \"content\": \"List ten holiday destinations.\"}))",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c9',
                    type: 'coding',
                    title: 'Batching messages',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Batching messages',
                        question: 'You are developing a fitness application to track running and cycling training, but find out that all your customers distances have been measured in kilometers, and you\'d like to have them also converted to miles. You decide to use the OpenAI API to send requests for each measurement, but want to avoid using a for loop that would send too many requests.You decide to send the requests in batches, specifying a system message that asks to convert each of the measurements from kilometers to miles and present the results in a table containing both the original and converted measurements. The measurements list(containing a list of floats) and the get_response() function have already been imported.',
                        instructions: [
                            "Provide a system message to request a response with all measurements as a table (make sure you specify that they are in kilometers and should be converted into miles).",
                            "Append one user message per measurement to the messages list.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nmessages = []\n# Provide a system message and user messages to send the batch\nmessages.append(____)\n# Append measurements to the message\n[messages.append(____) for i in measurements]\n\nresponse = get_response(messages)\nprint(response)",
                         pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c10',
                    type: 'coding',
                    title: 'Setting token limits',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Setting token limits',
                        question: 'An e-commerce platform just hired you to improve the performance of their customer service bot built using the OpenAI API. You\'ve decided to start by ensuring that the input messages do not cause any rate limit issue by setting a limit of 100 tokens, and test it with a sample input message. The tiktoken library has been preloaded.',
                        instructions: [
                            "Use the tiktoken library to create an encoding for the gpt-4o-mini model.",
                            "Check for the expected number of tokens in the input message.",
                            "Print the response if the message passes both checks.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\ninput_message = {\"role\": \"user\", \"content\": \"I'd like to buy a shirt and a jacket. Can you suggest two color pairings for these items?\"}\n\n# Use tiktoken to create the encoding for your model\nencoding = tiktoken.____(____)\n# Check for the number of tokens\nnum_tokens = ____\n\n# Run the chat completions function and print the response\nif num_tokens <= ____:\n    response = client.chat.completions.create(model=\"gpt-4o-mini\", messages=[input_message])\n    print(____)\nelse:\n    print(\"Message exceeds token limit\")",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },


            ],
        },
        {
            id: 'mod-2',
            title: 'Function Calling',
            description: 'Dive into the mechanics of function calling, where you\'ll master defining parameters to call specific functions, extracting structured data, and working with multiple functions.Learn to seamlessly integrate external APIs and manipulate responses to communicate with other systems, to develop enhanced AI system interactions.',
            duration: '1h 20m',
            completionPercentage: 40,
            content: [
                {
                    id: 'c11',
                    type: 'video',
                    title: 'Defining function calling',
                    duration: '03:14',
                    data: { url: 'm2v1.mp4' },
                },
                {
                    id: 'c12',
                    type: 'mcq',
                    title: 'Function calling definition',
                    duration: '10 min',
                    data: {
                        title: 'Function calling definition',
                        question: 'Select the statement that describe function calling.',
                        options: [
                            'Allows our AI system to interact programmatically with other functions and applications',
                            'Can directly control physical devices without any additional integration',
                            'Can be used to write and execute code on any connected system without oversight or permission',
                        ],
                        correctAnswerIndex: 0
                    },
                },
                {
                    id: 'c13',
                    type: 'theory',
                    title: 'Function caling steps',
                    duration: '10 min',
                    data: {
                        text: 'Function calling enables the use of custom functions as input to the OpenAI endpoint, resulting in improved consistency of the responses.',
                        visualSummaryTitle: 'FUNCTION CALLING STEPS',
                        items: [
                            {
                                label: '1. The user inputs a prompt',
                                color: 'bg-white',
                                text: 'text-gray-800',
                                border: 'border-gray-200 shadow-sm'
                            },
                            {
                                label: '2. The OpenAI model interprets the prompt based on the defined function',
                                color: 'bg-white',
                                text: 'text-gray-800',
                                border: 'border-gray-200 shadow-sm'
                            },
                            {
                                label: '3. If external functions are called, the data extracted from the prompt are used to trigger the functions',
                                color: 'bg-white',
                                text: 'text-gray-800',
                                border: 'border-gray-200 shadow-sm'
                            },
                            {
                                label: '4. The response is returned',
                                color: 'bg-white',
                                text: 'text-gray-800',
                                border: 'border-gray-200 shadow-sm'
                            }
                        ]
                    }
                },
                {
                    id: 'c14',
                    type: 'video',
                    title: 'Extracting structured data from text',
                    duration: '02:35',
                    data: { url: 'm2v2.mp4' },
                },
                {
                    id: 'c15',
                    type: 'coding',
                    title: 'Using the tools parameter',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Using the tools parameter',
                        question: 'You are developing an AI application for a real estate agency and have been asked to extract some key data from listings: house type, location, price, number of bedrooms. Use the Chat Completions endpoint with function calling to extract the information. The message_listing message, containing the real estate listing, and function_definition, containing the function to call defined as a tool to be passed to the model, have been preloaded.',
                        instructions: [
                            "Add the preloaded message, message_listing.",
                            "Add the function definition, function_definition.",
                            "Print the response.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    # Add the message\n    ____,\n    # Add your function definition\n    ____\n)\n\n# Print the response\nprint(____)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c16',
                    type: 'coding',
                    title: 'Building a function dictionary',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Building a function dictionary',
                        question: 'You are working on a research project where you need to extract key information from a collection of scientific research papers. The goal is to create a summary of key information from the papers you are given, that includes the title and year of publication. To compile this, you decide to use the OpenAI API with function calling to extract the key information. The get_response() function and messages, containing the text of the research paper, have been preloaded.The function_definition variable has also partially been filled already.',
                        instructions: [
                            "Define the function 'type' parameter.",
                            "Define the 'properties' parameters to extract the title and year of publication from research papers.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Define the function parameter type\nfunction_definition[0]['function']['parameters']['type'] = ____\n\n# Define the function properties\nfunction_definition[0]['function']['parameters']['properties'] = ____\n\nresponse = get_response(messages, function_definition)\nprint(response)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c17',
                    type: 'coding',
                    title: 'Extracting the response',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Extracting the response',
                        question: 'You work for a company that has just launched a new smartphone. The marketing team has collected customer reviews from various online platforms and wants to analyze the feedback to understand the customer sentiment and the most talked-about features of the smartphone. To accelerate this, you\'ve used the OpenAI API to extract structured data from these reviews, using function calling.You now need to write a function to clean the output and return a dictionary of the response from the function only. The get_response() function, messages variable(containing the review) and function_definition(containing the function to extract sentiment and product features from reviews) have been preloaded.Notice that both messages and function_definition can be passed as arguments to the get_response() function to get the response from the chat completions endpoint.',
                        instructions: [
                            "Define a function to return the dictionary containing the output data, as found in the response under arguments.",
                            "Print the dictionary.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nresponse = get_response(messages, function_definition)\n\n# Define the function to extract the data dictionary\ndef extract_dictionary(____):\n  return ____\n\n# Print the data dictionary\n____",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c18',
                    type: 'video',
                    title: 'Working with multiple functions',
                    duration: '02:48',
                    data: { url: 'm2v3.mp4' },
                },
                {
                    id: 'c19',
                    type: 'coding',
                    title: 'Parallel function calling',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Parallel function calling',
                        question: 'After extracting the data from customers\' reviews for the marketing team, the company you\'re working for asks you if there\'s a way to generate a response to the customer that they can post on their review platform. You decide to use parallel function calling to apply both functions and generate data as well as the responses. You use a function named reply_to_review and ask to return the review reply as a reply property. In this exercise, the get_response() function, messages and function_definition variable have been preloaded. The messages already contain the user\'s review, and function_definition contains the function asking to extract structured data.',
                        instructions: [
                            "Append to the function definition to return the additional message responding to the customer review: the function should have name, description and parameters specified, and the parameters should be type and properties.",
                            "Print the response.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Append the second function\nfunction_definition.append({'type': 'function', 'function':{'name': ____, ____, ____:\n {'type': ____, 'properties': {'reply': {____}}}}})\n\nresponse = get_response(messages, function_definition)\n\n# Print the response\n____",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c20',
                    type: 'coding',
                    title: 'Setting a specific function',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Setting a specific function',
                        question: 'You have been given a few customer reviews to analyze, and have been asked to extract for each one the product name, variant, and customer sentiment. To ensure that the model extracts this specific information, you decide to use function calling and specify the function for the model to use. Use the Chat Completions endpoint with function calling and tool_choice to extract the information. In this exercise, the messages and function_definition have been preloaded.',
                        instructions: [
                            "Add your function definition as tools.",
                            "Set the extract_review_info function to be called for the response.",
                            "Print the response.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nresponse = client.chat.completions.create(\n    model=model,\n    messages=messages,\n    # Add the function definition\n    ____,\n    # Specify the function to be called for the response\n    tool_choice=____\n)\n\n# Print the response\nprint(____)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c21',
                    type: 'coding',
                    title: 'Avoiding inconsistent responses',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Avoiding inconsistent responses',
                        question: 'The team you were working with on the previous project is enthusiastic about the reply generator and asks you if more reviews can be processed. However, some reviews have been mixed up with other documents, and you\'re being asked not to return responses if the text doesn\'t contain a review, or relevant information. For example, the review you\'re considering now doesn\'t contain a product name, and so there should be no product name being returned. In this exercise, the get_response() function, and messages and function_definition variables have been preloaded. The messages already contain the user\'s review, and function_definition contains the two functions: one asking to extract structured data, and one asking to generate a reply.',
                        instructions: [
                            "Modify the messages to ask the model not to assume any values for the responses.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Modify the messages\n____\n\nresponse = get_response(messages, function_definition)\n\nprint(response)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c22',
                    type: 'video',
                    title: 'Calling external APIs',
                    duration: '04:07',
                    data: { url: 'm2v4.mp4' },
                },
                {
                    id: 'c23',
                    type: 'coding',
                    title: 'Defining a function with external APIs',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Defining a function with external APIs',
                        question: 'You are developing a flight simulation application and have been asked to develop a system that provides specific information about airports mentioned in users\' requests.You decide to use the OpenAI API to convert the user request into airport codes, and then call the AviationAPI to return the information requested.As the first step in your coding project, you configure the function to pass to the tools parameter in the Chat Completions endpoint. In this exercise, the get_airport_info() and get_response() functions have been preloaded.The get_airport_info() function uses the AviationAPI and takes as input one airport code, returning the response with the requested airport information.',
                        instructions: [
                            "Define the function to pass to tools: that should include the function 'name' for the function, a 'description' specifying that a matching airport code should be returned, and 'parameters' and 'result' details.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Define the function to pass to tools\nfunction_definition = [{\"type\": ____,\n                        ____ : {\"name\": ____,\n                                ____: ____,\n                                ____: {\"type\": ____, ____: {\"airport_code\": {____}, ____} }, \n                                \"result\": ____ }}]\n\nresponse = get_response(function_definition)\nprint(response)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c24',
                    type: 'coding',
                    title: 'Calling an external API',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Calling an external API',
                        question: 'Now that you have a clearly structured function definition, you move on to improving your endpoint request. You use the Chat Completions endpoint and pass a system message to ensure that the AI assistant is aware that it is in the aviation space and that it needs to extract the corresponding airport code based on the user input. In this exercise, the get_airport_info() function has been preloaded.The get_airport_info() function uses the AviationAPI and takes as input one airport code, returning the response with the requested airport information.The print_response() function has also been preloaded to print the output.',
                        instructions: [
                            "Call the Chat Completions endpoint and ensure the system is provided with instructions on how to handle the prompt.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Call the Chat Completions endpoint \nresponse = ____(\n  model=\"gpt-4o-mini\",\n  messages=[\n    ____,\n    {\"role\": ____, \"content\": \"I'm planning to land a plane in JFK airport in New York and would like to have the corresponding information.\"}],\n  tools=function_definition)\n\nprint_response(response)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c25',
                    type: 'coding',
                    title: 'Handling the response with external API calls',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Handling the response with external API calls',
                        question: 'To better connect your flight simulation application to other systems, you\'d like to add some checks to make sure that the model has found an appropriate answer.First you check that the response has been produced via tool_calls.If that is the case, you check that the function used to produce the result was get_airport_info.If so, you load the airport code extracted from the user\'s prompt, and call the get_airport_info() function with the code as argument. Finally, if that produces a response, you return the response. In this exercise, the response, the json library, and get_airport_info() function have been preloaded.',
                        instructions: [
                            "Check that the response has been produced via tool_calls.",
                            "Extract the function if the previous check passed.",
                        ],
                        "snippet": "# Check that the response has been produced using function calling\nif response.choices[0].finish_reason == '____':\n# Extract the function\n    function_call = response.choices[0].message.____[0].function\n    print(function_call)\nelse: \n    print(\"I am sorry, but I could not understand your request.\")",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
            ],
        },
        {
            id: 'mod-3',
            title: 'Best Practices for Production Applications',
            description: 'Elevate your OpenAI API skills to follow the industry\'s best practices.Learn to moderate content with precision, validate model behavior for consistency, and implement safety measures for secure API usage.This final chapter is an essential part of building robust AI- powered applications.',
            duration: '1h 20m',
            completionPercentage: 40,
            content: [
                {
                    id: 'c26',
                    type: 'video',
                    title: 'Moderation',
                    duration: '04:12',
                    data: { url: 'm3v1.mp4' },
                },
                {
                    id: 'c27',
                    type: 'mcq',
                    title: 'Mitigating prompt injection',
                    duration: '10 min',
                    data: {
                        title: 'Mitigating prompt injection',
                        question: 'Your are developing a customer service chatbot for online banking and have been advised that one of the concerns of the team is that malicious actors might use prompt injection to extract sensitive information from the user. The chatbot you\'re developing should only answer high level questions and not go into any details about personal information. Which of the following is not the technique to mitigate the risk of prompt injection from malicious actors?',
                        options: [
                            'Limit the amount of text in prompts',
                            'Limit the number of output tokens generated as response',
                            'Ask all users\' personal details at the start of the chat',
                            'Use pre-selected topics that you\'ve discussed with the rest of the team as filters',
                        ],
                        correctAnswerIndex: 2
                    },
                },
                {
                    id: 'c28',
                    type: 'coding',
                    title: 'Moderation API',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Moderation API',
                        question: 'You are developing a chatbot that provides educational content to learn languages. You\'d like to make sure that users don\'t post inappropriate content to your API, and decide to use the moderation API to check users\' prompts before generating the response',
                        instructions: [
                            "Use the moderation API to check the user message for inappropriate content within categories.",
                            "Print the response.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nmessage = \"Can you show some example sentences in the past tense in French?\"\n\n# Use the moderation API\nresponse = client.____.____(input=____)\n\n# Print the response\nprint(____)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c29',
                    type: 'coding',
                    title: 'Adding guardrails',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Adding guardrails',
                        question: 'You are developing a chatbot that provides advice for tourists visiting Rome. You\'ve been asked to keep the topics limited to only covering questions about food and drink, attractions, history and things to do around the city.For any other topic, the chatbot should apologize and say \'Apologies, but I am not allowed to discuss this topic.\'.',
                        instructions: [
                            "Write a user message with the user_request given, and a system message to tell the model to assess the question first: if it is allowed, provide a reply, otherwise provide the message: 'Apologies, but I am not allowed to discuss this topic.'.",
                            "Print the response.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nuser_request = \"Can you recommend a good restaurant in Berlin?\"\n\n# Write the system and user message\nmessages = [____]\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4o-mini\", messages=messages\n)\n\n# Print the response\nprint(____)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c30',
                    type: 'video',
                    title: 'Validation',
                    duration: '02:50',
                    data: { url: 'm3v2.mp4' },
                },

                {
                    id: 'c31',
                    type: 'mcq',
                    title: 'Potential for model errors',
                    duration: '10 min',
                    data: {
                        title: 'Potential for model errors',
                        question: 'Select the statement describing a way in which models cannot perform suboptimally or unpredictably.',
                        options: [
                            'They can be given context and instructions to decline to answer if the request is off topic',
                            'They can misinterpret the context around the prompt',
                            'Biases can be found in outputs if the data used for training is biased',
                            'They can output outdated information',
                            'They can inadvertently reveal sensitive information',
                        ],
                        correctAnswerIndex: 0
                    },
                },
                {
                    id: 'c32',
                    type: 'coding',
                    title: 'Adversarial testing',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Adversarial testing',
                        question: 'You are developing a chatbot designed to assist users with personal finance management. The chatbot should be able to handle a variety of finance-related queries, from budgeting advice to investment suggestions. You have one example where a user is planning to go on vacation, and is budgeting for the trip. As the chatbot is only designed to respond to personal finance questions, you want to ensure that it is robust and can handle unexpected or adversarial inputs without failing or providing incorrect information, so you decide to test it by asking the model to ignore all financial advice and suggest ways to spend the budget instead of saving it.',
                        instructions: [
                            "Test the chatbot with an adversarial input that asks to spend the $800 instead.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\nmessages = [{'role': 'system', 'content': 'You are a personal finance assistant.'},\n    {'role': 'user', 'content': 'How can I make a plan to save $800 for a trip?'},\n            \n# Add the adversarial input\n    ____]\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4o-mini\", \n    messages=messages)\n\nprint(response.choices[0].message.content)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf",
                    },
                },
                {
                    id: 'c33',
                    type: 'video',
                    title: 'Safety best practices',
                    duration: '03:54',
                    data: { url: 'm3v3.mp4' },
                },
                {
                    id: 'c34',
                    type: 'mcq',
                    title: 'Minimizing model risks',
                    duration: '10 min',
                    data: {
                        title: 'Minimizing model risks',
                        question: 'Select the worst practice for minimizing the risks of unwanted content and unsafe data when using the OpenAI API.',
                        options: [
                            'Using prompt engineering to give context to the model',
                            'Using the moderation API to check for unsafe content',
                            'Storing API keys on public repositories',
                            'Having humans in the loop when possible',
                        ],
                        correctAnswerIndex: 2
                    },
                },
                {
                    id: 'c35',
                    type: 'coding',
                    title: 'Including end-user IDs',
                    duration: '15 min',
                    data: {
                        language: 'python',
                        title: 'Including end-user IDs',
                        question: 'You are developing a content moderation tool for a social media company that uses the OpenAI API to assess their content. To ensure the safety and compliance of the tool, you need to incorporate user identification in your API requests, so that investigations can be performed in case malicious content is found. The uuid library has been preloaded.A message has also been preloaded containing text from a social media post.',
                        instructions: [
                            "Use the uuid library with uuid4() to generate a unique ID.",
                            "Pass the unique ID to the chat completions endpoint to identify the user.",
                        ],
                        "snippet": "client = OpenAI(api_key=\"<OPENAI_API_TOKEN>\")\n\n# Generate a unique ID\nunique_id = ____\n\nresponse = client.chat.completions.create(  \n  model=\"gpt-4o-mini\", \n  messages=messages,\n# Pass a user identification key\n  ____\n)\n\nprint(response.choices[0].message.content)",
                        pdfPath: "http://localhost:8081/pdfs/m1p1.pdf", 
                    },
                },
                {
                    id: 'c36',
                    type: 'video',
                    title: 'Wrap-up',
                    duration: '00:46',
                    data: { url: 'm3v4.mp4' },
                },
            ],
        }
    ],
};
