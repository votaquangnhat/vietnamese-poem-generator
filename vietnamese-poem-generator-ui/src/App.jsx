import './App.css'
import '@mantine/core/styles.css';
import React, { useState } from "react";
import { MantineProvider, TextInput, Textarea, Button, Container, Card, Text, Group, Loader } from "@mantine/core";
import axios from "axios";

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [prompt, setPrompt] = useState("");
  const [poem, setPoem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePoem = async () => {
    setLoading(true);
    setError("");
    setPoem("");

    try {
      const response = await axios.post(`${API_BASE_URL}/generate_poem`, { prompt });
      setPoem(response.data.poem);
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vietnamese poem generator</h1>
      </header>
      <MantineProvider>
        <Container size="sm" style={{ marginTop: 50 }}>
          <Text align="center" color="dimmed" size="sm" style={{ marginBottom: 20 }}>
            Model Source: <a href="https://huggingface.co/votaquangnhat/vietnamese-poem-hustgpt2-lucbat" target="_blank" rel="noopener noreferrer">The model</a>
          </Text>
          <Group justify="center">
            <TextInput
              placeholder="Enter your prompt here"
              label="Prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              autosize
              minRows={2}
              style={{ marginBottom: 20 }}
            />

            <Button onClick={generatePoem} disabled={!prompt.trim() || loading}>
              {loading ? <Loader size="sm" color="white" /> : "Generate Poem"}
            </Button>

          </Group>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {error && <Text color="red" align="center">{error}</Text>}
            {poem && (
              <Text align="center" style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
                {poem}
              </Text>
            )}
          </Card>
        </Container>
      </MantineProvider>

    </div>
  );
}

export default App
