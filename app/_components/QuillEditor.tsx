'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { uploadImage } from '../_lib/cloudinary';
import colors from '../_constants/colors';

export default function QuillEditor({
  articleBody,
  setArticleBody,
  articleImages,
  setArticleImages,
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ['bold', 'italic', 'underline'],
          [{ color: colors }, { background: colors }, 'blockquote'],
          [
            { align: '' },
            { align: 'center' },
            { align: 'right' },
            { align: 'justify' },
          ],
          ['image', 'video'],
        ],
      },
    });

    if (articleBody)
      quillRef.current.clipboard.dangerouslyPasteHTML(articleBody);

    // Handle text changes
    quillRef.current.on('text-change', () => {
      const html = quillRef.current.root.innerHTML;
      setArticleBody(html);
    });

    // Handle image uploads
    quillRef.current.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = () => {
        const image = input.files[0];
        if (image) {
          const reader = new FileReader();

          reader.onload = async () => {
            setIsLoading(true);

            const dbImage = await uploadImage(image);

            setArticleImages((prev) => [
              ...prev,
              { id: dbImage?.id, url: dbImage?.url },
            ]);

            const range = quillRef.current.getSelection();
            quillRef.current.insertEmbed(range.index, 'image', dbImage?.url);
          };
          reader.readAsDataURL(image);
        }
      };
    });
  }, [setArticleBody, setArticleImages]);

  return (
    <>
      <div className="mt-4">
        <div ref={editorRef} />
      </div>
    </>
  );
}
