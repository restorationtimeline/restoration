import { pipeline } from "@huggingface/transformers";

export async function detectFaceInImage(file: File): Promise<boolean> {
  try {
    const detector = await pipeline(
      "object-detection",
      "Xenova/detr-resnet-50"
    );

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const results = await detector(base64);
    
    return results.some((result: any) => 
      result.label === "person" && result.score > 0.7
    );
  } catch (error) {
    console.error("Face detection error:", error);
    return true; // Allow upload if detection fails
  }
}