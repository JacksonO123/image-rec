import { ChangeEvent } from "@jacksonotto/lampjs";
import "./fileUpload.css";

type FileUploadProps = {
  onUpload: (src: string) => void;
};

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target!.result as string;
        onUpload(src);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <input
      accept="image/*"
      type="file"
      onChange={handleChange}
      class="file-input"
    />
  );
};

export default FileUpload;
