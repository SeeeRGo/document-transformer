//@ts-nocheck
"use client"
import React, { memo, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
const EditorJS = dynamic(() => import('@editorjs/editorjs'), {
  ssr: false
});
const Paragraph = dynamic(() => import('@editorjs/paragraph'), {
  ssr: false
});
const Header = dynamic(() => import('@editorjs/header'), {
  ssr: false
});
const List = dynamic(() => import('@editorjs/list'), {
  ssr: false
});
const Link = dynamic(() => import('@editorjs/link'), {
  ssr: false
});
const Delimiter = dynamic(() => import('@editorjs/delimiter'), {
  ssr: false
});
const CheckList = dynamic(() => import('@editorjs/checklist'), {
  ssr: false
});
const Table = dynamic(() => import('@editorjs/table'), {
  ssr: false
});

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  checkList: CheckList,
  list: List,
  header: Header,
  delimiter: Delimiter,
  link: Link,
  table: Table,
};

const Editor = ({ data, onChange, editorblock }: any) => {
  const ref = useRef<any>();
  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,

        tools: EDITOR_JS_TOOLS,
        data: data,
        async onChange(api: any, event: any) {
          const data = await api.saver.save();
          onChange(data);
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <div id={editorblock} />;
};

export default memo(Editor);