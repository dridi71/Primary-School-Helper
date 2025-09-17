import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ContentType, Difficulty, Subject, GeneratedContent } from '../types';

// FIX: Refactored API key handling to align with guidelines.
// The API key MUST be obtained exclusively from `process.env.API_KEY`.
// The `!` operator asserts that it's non-null, based on the guideline
// assumption that it is always pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const prompts = {
    arabic: {
        lesson: "بصفتك حكواتي ماهر ومعلم لغة عربية، اروِ قصة قصيرة وممتعة تشرح من خلالها درسًا في اللغة العربية. اجعل الشخصيات والأحداث هي التي توضح المفهوم (مثلاً، قصة عن 'التاء المربوطة' الحزينة التي تبحث عن صديقتها 'التاء المفتوحة').",
        exercise: "صمم 5 تحديات لغوية ممتعة على شكل ألغاز أو ألعاب كلمات (مثل: 'ابحث عن الكلمة المختبئة' أو 'أكمل القصة بكلمة مناسبة'). يجب أن تكون التمارين جزءًا من مغامرة لغوية."
    },
    math: {
        lesson: "أنت قائد مغامرة الأرقام. قدم درس رياضيات على شكل رحلة استكشافية. على سبيل المثال، اشرح الجمع والطرح كرحلة لجمع الكنوز أو فقدانها في جزيرة الأرقام. استخدم قصة بسيطة وأبطالًا أرقامًا.",
        exercise: "ابتكر 5 مهام رياضية ضمن 'مهمة سرية لإنقاذ عالم الأرقام'. يجب أن تكون كل مهمة لغزًا رياضيًا يتطلب من البطل الصغير (الطالب) استخدام مهاراته لحلها."
    },
    science: {
        lesson: "أنت مستكشف الطبيعة العظيم. اروِ قصة عن مغامرتك في استكشاف موضوع علمي (مثل دورة حياة الفراشة). في نهاية القصة، اقترح نشاطًا عمليًا بسيطًا جدًا يمكن للطفل القيام به، مثل رسم مراحل الدورة أو محاولة زراعة بذرة.",
        exercise: "صمم 5 'تجارب فكرية' أو أسئلة تحفيزية تشجع الطفل على أن يكون عالمًا صغيرًا. اطلب منه أن يلاحظ شيئًا في بيئته، أو يتخيل 'ماذا سيحدث لو...؟' بناءً على الدرس."
    },
    history: {
        lesson: "أنت مسافر عبر الزمن. اروِ قصة وكأنك قابلت شخصية تاريخية تونسية أو شهدت حدثًا تاريخيًا بنفسك. صف الأماكن والملابس والأصوات لجعل القصة حية. اقترح على الطفل أن يرسم مشهدًا من القصة.",
        exercise: "ابتكر 5 'مهام للمؤرخ الصغير'. يمكن أن تكون المهام عبارة عن أسئلة تحقيقية بسيطة (مثل: 'لماذا تعتقد أنهم بنوا هذا؟') أو نشاطًا إبداعيًا مثل تصميم عملة قديمة."
    },
    art: {
        lesson: "أنت فنان ساحر تستخدم الألوان والخطوط لسرد الحكايات. اشرح مفهومًا فنيًا من خلال قصة خيالية (مثلاً، قصة الألوان الثلاثة الأساسية التي اجتمعت لتكوين أصدقاء جدد). ادعُ الطفل في نهاية الدرس لتجربة ما تعلمه بنفسه فورًا.",
        exercise: "قدم 5 'تحديات فنية' إبداعية. كل تحدٍ يبدأ بـ 'تخيل أنك...' (مثل: 'تخيل أنك تستطيع الطيران، ماذا سترى في الأسفل؟ ارسمه!') لتحفيز الخيال وليس فقط المهارة."
    },
    geography: {
        lesson: "أنت رحالة شهير يأخذنا في جولة حول العالم. اروِ قصة عن زيارتك لمكان جغرافي مذهل في تونس أو العالم (مثل الصحراء الكبرى أو نهر النيل). صف التضاريس، المناخ، والنباتات بأسلوب شيق. اقترح على الطفل صنع مجسم بسيط من الصلصال أو رسم خريطة كنزه الخاصة للمكان.",
        exercise: "صمم 5 'ألغاز جغرافية' ممتعة. يمكن أن تكون على شكل 'أين أنا؟' حيث تصف مكانًا وعلى الطفل تخمين اسمه، أو اطلب منه رسم خريطة منزله إلى المدرسة."
    }
};

const difficultyInstructions = {
    [Difficulty.Easy]: "اجعل المحتوى سهلًا جدًا ومناسبًا للمبتدئين تمامًا.",
    [Difficulty.Medium]: "قدم محتوى بمستوى صعوبة متوسط، به بعض التحدي البسيط.",
    [Difficulty.Hard]: "صمم محتوى متقدمًا به تحدي واضح ومناسب للطلاب المتميزين."
};

export const generateContent = async (subjectId: Subject['id'], type: ContentType, difficulty: Difficulty): Promise<GeneratedContent> => {
    const basePrompt = prompts[subjectId][type];
    if (!basePrompt) {
        throw new Error("Invalid subject or content type");
    }

    const difficultyInstruction = difficultyInstructions[difficulty];
    const finalPrompt = `${basePrompt}\n\nتوجيه إضافي بخصوص مستوى الصعوبة: ${difficultyInstruction}`;

    try {
        // 1. Generate lesson/exercise text
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
            config: {
              systemInstruction: "أنت مرشد تعليمي مبدع وساحر، متخصص في جعل التعلم مغامرة شيقة لطلاب الصف الثاني الابتدائي في تونس. مهمتك هي صياغة دروس وتمارين تتبع المنهج الرسمي التونسي، لكن بأسلوب قصصي يأسر الخيال. حول كل درس إلى حكاية ممتعة، وكل تمرين إلى تحدٍ ممتع. عند إنشاء الدروس، لا تكتفِ بدمج أسئلة بسيطة، بل اقترح أيضًا أنشطة عملية بسيطة يمكن للطالب القيام بها في المنزل (مثل رسم، تجربة بسيطة، أو لعبة حركية). يجب أن تكون لغتك العربية الفصحى بسيطة ومفعمة بالحياة. كن دائمًا شخصية إيجابية، مشجعة، وملهمة.",
            }
        });
        
        const generatedText = textResponse.text;
        let imageUrl: string | null = null;

        // 2. If it's a lesson, generate an image
        if (type === ContentType.Lesson && generatedText) {
            try {
                // 2a. Generate a simple English prompt for the image model
                const imagePromptGeneratorResponse: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Based on the following lesson for a 7-year-old, create a simple, single-sentence image prompt for an AI image generator. The prompt should describe a colorful, cute, and child-friendly cartoon-style illustration that captures the essence of the lesson. The prompt must be in English. Lesson: "${generatedText}"`,
                });
                const imagePrompt = imagePromptGeneratorResponse.text;

                if (imagePrompt) {
                     // 2b. Generate the image
                    const imageResponse = await ai.models.generateImages({
                        model: 'imagen-4.0-generate-001',
                        prompt: imagePrompt,
                        config: {
                          numberOfImages: 1,
                          outputMimeType: 'image/png',
                          aspectRatio: '16:9',
                        },
                    });
                    
                    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                        const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
                        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    }
                }
            } catch (imageError) {
                console.error("Error generating image:", imageError);
                // Non-critical error, proceed without an image
            }
        }

        return { text: generatedText, imageUrl };
        
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        throw new Error("Failed to fetch content from AI service.");
    }
};