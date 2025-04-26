import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, FileText } from "lucide-react";
import api from '../../api';

function SupplierVerification() {
    const [photo, setPhoto] = useState(null);
    const [isReviw, setReviw] = useState(null)
    const [license, setLicense] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const videoRef = useRef(null);
    const photoInputRef = useRef(null);
    const licenseInputRef = useRef(null);
    const streamRef = useRef(null);

    // Clean up camera on component unmount
    // Without this, the user's camera might stay on in the background even after they leave the page — wasting resources and potentially causing privacy issues.

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const dataURLtoFile = (dataUrl, filename) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };

    // This will run when `photo` updates
    useEffect(() => {
        if (photo && typeof photo === 'string') {
            const file = dataURLtoFile(photo, 'captured-photo.jpg');
            setPhotoFile(file);
        } else if (photo instanceof File) {
            setPhotoFile(photo);
        }
    }, [photo]);


    // Effect to handle video element when camera becomes active
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraActive]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const handleLicenseUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLicense(file);
        }
    };

    // Camera functions
    const startCamera = async () => {
        try {
            // Reset any previous errors
            setCameraError(null);

            // Request camera with specific constraints for better compatibility
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // Use front camera on mobile devices
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            // Store stream reference
            streamRef.current = stream;

            // Update state to show camera UI
            setCameraActive(true);

            // Explicitly set the stream to the video element
            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Make sure the video plays
                videoRef.current.play().catch(e => {
                    console.error("Error playing video:", e);
                    setCameraError("Could not play camera stream. Please try again.");
                });
            }
        } catch (err) {
            console.error("Error accessing camera:", err);

            // Set appropriate error message based on error type
            if (err.name === 'NotAllowedError') {
                setCameraError("Camera access denied. Please allow camera access in your browser settings.");
            } else if (err.name === 'NotFoundError') {
                setCameraError("No camera found on this device.");
            } else if (err.name === 'NotReadableError') {
                setCameraError("Camera may be in use by another application.");
            } else {
                setCameraError("Could not access camera: " + err.message);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
        setCameraError(null);
    };



    const capturePhoto = () => {
        if (videoRef.current) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL('image/jpeg');
                setPhoto(dataUrl);
                stopCamera();
            } catch (err) {
                console.error("Error capturing photo:", err);
                setCameraError("Failed to capture photo. Please try again.");
            }
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo || !license) {
            alert("Please provide both a photo and license document");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();

        formData.append('photo', photoFile);
        formData.append('license', license);


        // Simulate API call
        try {
            const result = await api.post('/supplier/supplier-verifing', formData)

            if (result.data.status) {
                console.log(result.data.message)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsSubmitting(false)
        }
    };

    useEffect(() => {
        const chekIsReviw = async () => {
            try {
                const result = await api.get('/supplier/chek-reviw')

                if (result.data.status) {
                    setReviw(result.data.reviw)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        chekIsReviw()

    }, [])

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-4">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between">
                <div>
                    <h2 className="text-xl font-medium">Supplier Documentation</h2>
                    <p className="text-blue-100 text-sm">Upload supplier photo and license documentation</p>
                </div>
                <div>

                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8  justify-end items-center ">
                    {/* Photo Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800">Supplier Photo</h3>
                            <div className="text-xs text-gray-500">Required</div>
                        </div>

                        {
                            isReviw && (
                                <span className='bg-green-100 text-green-800 w-full px-2 rounded-lg'>
                                    <>Processing... Update if needed.</>
                                </span>
                            )
                        }

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex flex-col items-center">
                                {/* Photo Preview or Camera View */}
                                <div className="w-full h-64 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                    {cameraActive ? (
                                        <>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="min-w-full min-h-full object-cover"
                                            />
                                            {cameraError && (
                                                <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center text-white p-4 text-center">
                                                    <div>
                                                        <X size={40} className="mx-auto mb-2" />
                                                        <p>{cameraError}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : photo ? (
                                        <img
                                            src={photo}
                                            alt="Supplier"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Camera size={48} className="mx-auto mb-2" />
                                            <p>No photo selected</p>
                                        </div>
                                    )}
                                </div>

                                {/* Camera Error Message */}
                                {cameraError && !cameraActive && (
                                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                        {cameraError}
                                    </div>
                                )}

                                {/* Photo Actions */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    {!cameraActive ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => photoInputRef.current.click()}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <Upload size={16} className="mr-2" />
                                                Upload Photo
                                            </button>

                                            <input
                                                type="file"
                                                ref={photoInputRef}
                                                onChange={handlePhotoUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <Camera size={16} className="mr-2" />
                                                Use Camera
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={capturePhoto}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                disabled={!!cameraError}
                                            >
                                                <Camera size={16} className="mr-2" />
                                                Capture Photo
                                            </button>

                                            <button
                                                type="button"
                                                onClick={stopCamera}
                                                className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                <X size={16} className="mr-2" />
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {photo && !cameraActive && (
                                        <button
                                            type="button"
                                            onClick={() => setPhoto(null)}
                                            className="inline-flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-100"
                                        >
                                            <X size={16} className="mr-1" />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* License Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800">License Document</h3>
                            <div className="text-xs text-gray-500">Required</div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 flex flex-col">
                            <div className="flex-1 flex flex-col items-center justify-center">
                                {!license ? (
                                    <div
                                        onClick={() => licenseInputRef.current.click()}
                                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-6 py-10 text-center hover:border-blue-500 transition-colors"
                                    >
                                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600">
                                            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PDF, DOC, DOCX, PNG, JPG (max. 10MB)
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-green-100 rounded-lg bg-green-50 px-6 py-10">
                                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                            <CheckCircle size={32} className="text-green-600" />
                                        </div>
                                        <p className="text-green-800 font-medium">{license.name}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {Math.round(license.size / 1024)} KB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setLicense(null)}
                                            className="mt-4 inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <X size={12} className="mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={licenseInputRef}
                                onChange={handleLicenseUpload}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !photo || !license}
                        className={`
                inline-flex items-center px-5 py-2 rounded-md text-sm font-medium text-white 
                ${(!photo || !license)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isSubmitting
                                    ? 'bg-blue-600 opacity-75'
                                    : 'bg-blue-600 hover:bg-blue-700'}
              `}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : submitted ? (
                            <>
                                <CheckCircle size={16} className="mr-2" />
                                Submitted!
                            </>
                        ) : (
                            'Upload Documents'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SupplierVerification;