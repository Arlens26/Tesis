import { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import PropTypes from 'prop-types';

const MonacoEditorWrapper = ({ code, language, theme, size }) => {
const editorRef = useRef(null);
const codeRef = useRef(code);

    useEffect(() => {

        if (editorRef.current) {
            const disposable = editorRef.current.onDidChangeModelContent(() => {
                codeRef.current = editorRef.current.getValue();
                //console.log('Nuevo valor de codeRef:', codeRef.current);
            });

            return () => {
                disposable.dispose();
            };
        }
    }, []);

  return (
    <MonacoEditor
      ref={editorRef}
      width="820px"
      height="250px"
      language={language}
      theme={theme}
      value={code}
      onChange={(newValue) => {
        console.log('New Value: ', newValue);
      }}
      options={{
        selectOnLineNumbers: true,
        fontSize: 16,
      }}
    />
  );
};

MonacoEditorWrapper.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default MonacoEditorWrapper;
