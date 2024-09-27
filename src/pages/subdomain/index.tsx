// pages/[subdomain]/index.js
import Editor from '@/components/Editor';
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function SubdomainPage() {
  const router = useRouter()
  const { subdomain } = router.query
    console.log('subdomain :>> ', subdomain);
  const [editorData, setEditorData] = useState('<p>Hello from CKEditor 5!</p>');
  const handleEditorChange = (data:any) => {
    setEditorData(data);
  };

  return (
    <div>
      <h1>Subdomain: {subdomain}</h1>
      <Editor editorData={editorData} handleEditorChange={handleEditorChange} />

      {/* Render the content based on the subdomain */}
    </div>
  )
}