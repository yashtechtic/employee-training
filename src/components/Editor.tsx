// import dynamic from 'next/dynamic';
// import React, { useState, useRef, useMemo, useEffect } from 'react';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// interface EditorProps {
//     editorData?: string;
//     handleEditorChange: (content: string) => void;
// }

// const Editor: React.FC<EditorProps> = ({ editorData, handleEditorChange }) => {
//     const editor = useRef<any>(null); // Ref type should match the expected ref type of JoditEditor
//     const [content, setContent] = useState<string>('');
//     const config = useMemo(
//         () => ({
//             readonly: false, // all options from https://xdsoft.net/jodit/docs/,
//             placeholder: 'Start typings...',
//             style: {
//                 background: 'white',
//                 color: 'black',
//                 minHeight: '350px',
//             },
//             buttons: [
//                 'source','|',
//                 'bold',
//                 'italic',
//                 'underline',
//                 'strikethrough', '|',
//                 'ul',
//                 'ol', '|',
//                 'font',
//                 'fontsize',
//                 'paragraph', '|',
//                 'lineHeight',
//                 'superscript',
//                 'subscript',
//                 'classSpan',
//                 'file',
//                 'image',
//                 'video',
//                 'spellcheck',
//                 // 'speechRecognize',
//                 'cut',
//                 'copy',
//                 'paste',
//                 'selectall',
//                 'copyformat',
//                 'hr',
//                 'table',
//                 'link',
//                 'symbols',
//                 // 'ai-commands',
//                 // 'ai-assistant',
//                 'indent',
//                 'outdent',
//                 'left',
//                 'brush',
//                 'undo',
//                 'redo',
//                 'find',
                
//                 'fullsize',
//                 'preview',
//                 'print',
//                 'about'
//             ],
//             iframeCSSLinks: [], 
//         }),
//         []
//     );

//     const handleChange = (newContent: string) => {
//         setContent(newContent);
//         handleEditorChange(newContent);
//     };
//     useEffect(() => {
//         if(editorData) setContent(editorData);
//     }, [editorData]);
//     return (<>
//         <JoditEditor
//             ref={editor}
//             value={content}
//             config={config}
//             onBlur={() => {}} // Avoid unnecessary re-renders on blur
//             onChange={handleChange}
//         /></>
//     );
// };

// export default Editor;


import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import("jodit-react"), {ssr: false});

interface EditorProps {
  editorData?: string | any;
  handleEditorChange: (content: string) => void;
  readonly?: boolean;
}

const Editor: React.FC<EditorProps> = ({ editorData, handleEditorChange,readonly=false }) => {
    const editor = useRef<any>(null); 
    const [content, setContent] = useState<string>(editorData || '');
    const config = useMemo(
        () => ({
            readonly: readonly,
            disabled: readonly,

            placeholder: 'Start typing...',
            style: {
                background: 'white',
                color: 'black',
                minHeight: '350px',
            },
            buttons: readonly ?[]: [
                'source', '|',
                'bold',
                'italic',
                'underline',
                'strikethrough', '|',
                'ul',
                'ol', '|',
                'font',
                'fontsize',
                'paragraph', '|',
                'lineHeight',
                'superscript',
                'subscript',
                'classSpan',
                'file',
                'image',
                'video',
                'spellcheck',
                'cut',
                'copy',
                'paste',
                'selectall',
                'copyformat',
                'hr',
                'table',
                'link',
                'symbols',
                'indent',
                'outdent',
                'left',
                'brush',
                'undo',
                'redo',
                'find',
                'fullsize',
                'preview',
                'print',
                'about'
            ],
            iframeCSSLinks: [], 
        }),
        [readonly]
    );

    useEffect(() => {
        setContent(editorData || '');
    }, [editorData]);

    const handleChange = (newContent: string) => {
        setContent(newContent);
        handleEditorChange(newContent);
    };

    return (
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={() => {}}
            onChange={handleChange}
        />
    );
};

export default Editor;
