import z from "zod";


export const uploadDocumentSchema = z.object({


    type: z.enum(['AADHAR','PAN','PASSPORT','ADDRESS_PROOF']),
});


// export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
