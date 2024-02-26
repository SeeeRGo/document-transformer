//@ts-nocheck
"use client"
import React, { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from '@editorjs/paragraph'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Link from '@editorjs/link'
import Delimiter from '@editorjs/delimiter'
import CheckList from '@editorjs/checklist'
import Table from '@editorjs/table'

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
      console.log('data', data);
      
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