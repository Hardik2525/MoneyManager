import { useEffect, useRef, useState } from "react";
import { Trash, Upload, User } from "lucide-react";

const ProfilePhotoSelector = ({ profileImage, setProfileImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setProfileImage(null);
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!profileImage ? (
                <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                    <User className="text-purple-500" size={35} />
                    <button
                        onClick={onChooseFile}
                        className="w-8 h-8 flex items-center justify-center bg-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <Upload size={15} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="Profile photo" className="w-20 h-20 rounded-full object-cover" />
                    <button
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <Trash size={15} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
