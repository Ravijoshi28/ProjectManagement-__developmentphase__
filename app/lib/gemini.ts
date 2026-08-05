import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function gemini(text:string,url:string,mimeType:string){
  
    const res = await fetch(url);

if (!res.ok) {
  throw new Error("Unable to fetch image");
}

const buffer = Buffer.from(await res.arrayBuffer());

const base64 = buffer.toString("base64");

    console.log(text,url,mimeType)
  
  const interaction = await ai.interactions.create({
 model: "gemini-3.6-flash",
  input: [
    { type: "text", text:`${text} 'in short'` },
    {
      type: "image",
      data: base64,
      mime_type: mimeType
    }
  ],
});


console.log(interaction.output_text);
return interaction.output_text;
}
