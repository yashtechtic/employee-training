import React, {useState} from "react";
import {Button, Divider, Image, Modal, Upload} from "antd";
import {useNotification} from "../Notification";
import ImagePlus from "../Icons/ImagePlus";
import uploadFile from "@/src/helper/UploadFIle";

const {Dragger} = Upload;

interface ImageUploaderProps {
  openImageModel: boolean;
  handleImageModel: () => void;
  image: any;
  setImage: any;
  setImageUploadError: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  openImageModel,
  handleImageModel,
  image,
  setImage,
  setImageUploadError,
}) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [uploading, setUploading] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to Bytes

  const fileUploading = async (file: File) => {
    try {
      setUploading(true);
      let uploadRes = await uploadFile(file);
      console.log("uploadRes", uploadRes);
      if (uploadRes?.settings?.success) {
        setUploading(false);
        setImage(uploadRes?.data?.url);
        setImageUploadError(false);
        setUploadedImageName(uploadRes?.data?.name);
        handleNotifications("success", "File uploaded successfully!");
        handleImageModel();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploading(false);
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  const handleUploadChange = (info: any) => {
    const {file} = info;
    if (file.status !== "uploading") {
      if (file.size > MAX_FILE_SIZE) {
        handleNotifications(
          "error",
          `File size should be less than or equal to ${MAX_FILE_SIZE_MB}MB.`
        );
        return;
      }
      fileUploading(file.originFileObj);
    }
  };

  return (
    <Modal
      width={387}
      footer={null}
      title={
        <p className="text-[#000000] text-[20px] font-[600]">
          Add Cover Picture
        </p>
      }
      open={openImageModel}
      onCancel={handleImageModel}
    >
      <div >
        <Divider />
        <Dragger
          className="custom-image-drag"
          showUploadList={false}
          beforeUpload={(file) => {
            if (file.size > MAX_FILE_SIZE) {
              handleNotifications(
                "error",
                `File size should be less than or equal to ${MAX_FILE_SIZE_MB}MB.`
              );
              return false;
            }
            fileUploading(file);
            return false;
          }}
        >
          <div className="w-[170px] h-[170px] rounded-[10px] bg-[#F2F2F2] flex justify-center ml-[25%]">
            <div className="flex justify-center p-[30%]">
              {uploadedImageName ? (
                <div className="mt-4 text-center text-[16px] font-Nunito Sans font-[600] leading-[24px] text-[#4F4F4F]">
                  <Image
                    className="rounded-[10px] object-cover"
                    src={image}
                    alt="uploadedImageName"
                    preview={false}
                    width={170}
                    height={170}
                  />
                </div>
              ) : (
                <ImagePlus />
              )}
            </div>
          </div>
        </Dragger>
        <div>
          <div className="flex justify-center text-[16px] font-Nunito Sans font-[600] leading-[24px] text-[#4F4F4F]">
            Drag photo here
          </div>
          <div className="flex justify-center text-[16px] font-Nunito Sans font-[600] leading-[24px] text-[#4F4F4F]">
            or
          </div>
        </div>
        <Upload onChange={handleUploadChange} showUploadList={false}>
          <Button
            type="primary"
            size="large"
            className="bg-[#4379EE] rounded-[8px] text-[#FFFFFF] common-button min-w-[347px] mt-2"
            loading={uploading}
          >
            Upload From Computer
          </Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default ImageUploader;
