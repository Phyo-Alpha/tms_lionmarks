// import React, { useEffect, useMemo, useState } from "react";
// import { FileUploader, FileUploaderProps } from "@/client/components/file-uploader";
// import { fileUploadServices } from "@/features/file-upload/services";
// import { cn } from "@/client/lib/utils";
// import { Control, useController, useFormContext } from "react-hook-form";

// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../form";
// import { DropzoneProps } from "react-dropzone";

// export type FormFileUploaderProps<C extends { [k: string]: any } = any> =
//   FileUploaderProps & {
//     name: keyof C extends string ? keyof C : string;
//     control?: Control<C>;
//     label?: React.ReactNode;
//     FormFieldProps?: React.ComponentPropsWithoutRef<typeof FormField>;
//     FormLabelProps?: React.ComponentPropsWithoutRef<typeof FormLabel>;
//   } & {
//     fileType?: "image" | "file";
//     accept?: DropzoneProps["accept"];
//   };

// const FormFileUploader = ({
//   name,
//   control,
//   label,
//   FormFieldProps,
//   FormLabelProps,
//   ...props
// }: FormFileUploaderProps) => {
//   const uploadFile = fileUploadServices.useUploadFile();

//   // convert s3 url to file object
//   const convertUrlToFile = async (url: any) => {
//     if (!url || typeof url !== "string") return url;

//     const response = await fetch(url, {
//       mode: "cors",
//     });

//     const blob = await response.blob();

//     const urlObject = new URL(url);
//     const fileName = urlObject.pathname.split("/").pop() || "file";

//     const file = new File([blob], fileName, {
//       type: blob.type,
//     });
//     // Create a new object with File properties + preview
//     const fileWithPreview = {
//       ...file, // Spread operator copies enumerable properties
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       lastModified: file.lastModified,
//       preview: url, // added preview for the file uploader to render the image
//     };
//     return fileWithPreview;
//   };

//   // handling form value setting manually cause we are using upload file endpoint to upload to s3
//   const form = useFormContext();
//   const field = useController({ name });

//   const initialFiles = useMemo(() => {
//     return field.field.value
//       ? Array.isArray(field.field.value)
//         ? field.field.value
//         : [field.field.value]
//       : [];
//   }, [field.field.value]);

//   const [files, setFiles] = useState<File[]>();

//   useEffect(() => {
//     const fetchFiles = async () => {
//       if (!initialFiles || initialFiles.length === 0) return;
//       const filePromises = initialFiles.map((url) => convertUrlToFile(url));
//       const files = await Promise.all(filePromises);
//       setFiles(files);
//     };
//     fetchFiles();
//   }, [initialFiles]);

//   const handleRemoveFile = (removedFiles: File[], newFiles: File[]) => {
//     setFiles(newFiles)
//     const urls = form.getValues(name)
//     const removeFileUrls = removedFiles.map((file) => 'preview' in file && file.preview)

//     form.setValue(name, Array.isArray(urls) ? urls.filter((url) => !removeFileUrls.includes(url)) : undefined, { shouldDirty: true, shouldTouch: true })
//     form.trigger(name)
//     form.clearErrors(name)
//   }

//   const handleUploadFile = async (files: File[]) => {
//     if (!files || files.length === 0) return;

//     const multiple = files.length > 1;

//     // Assuming when I either remove or change the file, AWS S3 will delete the previous unused file
//     const { urls } = await uploadFile.mutateAsync(
//       { files },
//       {
//         onSuccess: (data) => {
//           return data.urls;
//         },
//         onError: (error) => {
//           form.setError(name, { message: error.data.message });
//         },
//       },
//     );

//     if (!urls || urls.length === 0) return;

//     setFiles(files);
//     form.setValue(name, multiple ? urls : urls[0], { shouldDirty: true });
//     form.trigger(name);
//     form.clearErrors(name);
//   };

//   useEffect(() => {
//     if (
//       field.fieldState.error &&
//       field.fieldState.error.message !== form.getFieldState(name).error?.message
//     ) {
//       form.setError(name, { message: field.fieldState.error.message });
//     }
//   }, [form, field]);

//   return (
//     <FormField
//       control={control}
//       name={name}
//       {...FormFieldProps}
//       render={() => (
//         <div className="space-y-6">
//           <FormItem className="w-full">
//             <FormControl>
//               <div className="flex flex-col gap-4">
//                 <FormLabel
//                   className={cn(
//                     "text-muted-foreground text-sm font-normal",
//                     FormLabelProps?.className,
//                   )}
//                   {...FormLabelProps}
//                 >
//                   {label}
//                 </FormLabel>
//                 <FileUploader
//                   value={files}
//                   onValueChange={handleUploadFile}
//                   onRemoveFile={handleRemoveFile}
//                   maxFileCount={1}
//                   maxSize={4 * 1024 * 1024}
//                   info={
//                     <p className="text-sm tracking-wide">
//                       Drag & Drop the file here
//                     </p>
//                   }
//                   {...props}
//                 />
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         </div>
//       )}
//     />
//   );
// };

// export default FormFileUploader;
