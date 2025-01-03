'use client';

import { useState, useRef, ChangeEvent, MouseEvent } from 'react';
import html2canvas from 'html2canvas-pro';
import styles from '../styles/GiftCard.module.css';

interface FormData {
    dear: string;
    message: string;
    from: string;
    image: string | null;
}

interface Errors {
    dear: string;
    message: string;
    from: string;
    image: string;
}

const GiftCard = () => {
    const [formData, setFormData] = useState<FormData>({ dear: '', message: '', from: '', image: null });
    const [errors, setErrors] = useState<Errors>({ dear: '', message: '', from: '', image: '' });
    const cardRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = { dear: '', message: '', from: '', image: '' };
        if (!formData.dear) newErrors.dear = 'Dear is required';
        if (!formData.message) newErrors.message = 'Message is required';
        if (!formData.from) newErrors.from = 'From is required';
        if (!formData.image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, image: reader.result as string });
                setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleDownload = () => {
        if (!validateForm()) return;
        if (cardRef.current) {
            html2canvas(cardRef.current).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = 'image-with-text.png';
                link.click();
            });
        }
    };
    

    return (
        <div className="min-h-screen">
            <h1>Gift Card</h1>
            <div className="relative" ref={cardRef}>
                {formData.image ? (
                    <img src={formData.image} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed p-4">
                        Upload an image
                    </div>
                )}

                {formData.image && (
                    <div>
                        <div className="absolute  top-1/3 left-1/3 ml-8 sm:ml-12 sm:text-2xl  transform -translate-y-1/2 text-lg md:text-xl text-black p-4">
                            <p>{formData.dear}</p>
                        </div>
                        <div className="absolute bottom-1/3 mb-16 sm:text-2xl text-lg md:top-36 mt-1  w-full px-4">
                            <div className="h-[70px] sm:h-[80px]  w-full p-4 md:p-0  overflow-hidden">
                                <p className="break-words leading-7 md:leading-9">{formData.message}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-1 mb-32 left-1/3 ml-5 sm:text-2xl  mt-4 text-lg md:mb-36  md:mt-2 md:left-38 md:text-xl  text-black p-4">
                            <p>{formData.from}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="">
                <div className="my-3">
                    <p>File Upload</p>
                    <input
                        type="file"
                        data-testid="file-upload"
                        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {errors.image && <p className={styles.error}>{errors.image}</p>}
                </div>

                <div className="my-3">
                    <p>Dear</p>
                    <input
                        className="input input-sm input-bordered w-full max-w-xs"
                        type="text"
                        data-testid="dearInput"
                        name="dear"
                        value={formData.dear}
                        onChange={handleInputChange}
                    />
                    {errors.dear && <p className={styles.error}>{errors.dear}</p>}
                </div>

                <div className="my-3">
                    <p>Message</p>
                    <input
                        className="input input-sm input-bordered w-full max-w-xs"
                        type="text"
                        data-testid="messageInput"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                    />
                    {errors.message && <p className={styles.error}>{errors.message}</p>}
                </div>

                <div className="my-3">
                    <p>From</p>
                    <input
                        className="input input-sm input-bordered w-full max-w-xs"
                        type="text"
                        data-testid="fromInput"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                    />
                    {errors.from && <p className={styles.error}>{errors.from}</p>}
                </div>
            </div>
            <div className='flex justify-center'>

                <button className="btn btn-primary" onClick={handleDownload}>
                    Download
                </button>
            </div>
        </div>
    );
};

export default GiftCard;
