import React from 'react';
import styled from 'styled-components';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { theme } from './styles/theme';

const AppContainer = styled.div`
  background-color: ${theme.colors.background};
  min-height: 100vh;
  font-family: ${theme.fonts.primary};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SubmitSection = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

function App() {
  return (
    <AppContainer>
      <PipelineToolbar />
      <MainContent>
        <PipelineUI />
      </MainContent>
      <SubmitSection>
        <SubmitButton />
      </SubmitSection>
    </AppContainer>
  );
}

export default App;
