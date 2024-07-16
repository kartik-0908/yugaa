"use client"
import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import ColorPicker from "./ColorPicker";
import { Textarea } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import styles from './ChatInput.module.css';
import { useUser } from "@clerk/nextjs";
import { uploadLogo } from "../../../actions/gcpservices";
import { useToasts } from "@geist-ui/core";

const fonts = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Garamond', value: 'Garamond, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Brush Script MT', value: 'Brush Script MT, cursive' },
];
const color = [
    { label: "White", value: "White" },
    { label: "Black", value: "Black" },
]

const demo_mssgs = [
    "Hi, How may i help you",
    "Can you give me the brief about the latest discounts on the A387 Headset"
]



const TablesPage = () => {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
        return (
            <div>
                loading
            </div>
        );
    }
    const { setToast } = useToasts()

    const [selected, setSelected] = React.useState("appearance");
    const colors = ['#4F46E5', '#EC4899', '#22C55E', '#F59E0B', '#EF4444', '#6366F1'];
    const [selectedColor, setSelectedColor] = useState('')
    const [botName, setBotName] = useState('');
    const [fontFamily, setFontFamily] = useState('');
    const [fontColor, setFontColor] = useState('');
    const [widgetPosition, setWidgetPosition] = useState('');
    const [greetingmessage, setgreetingmessage] = useState('');
    const [toneAndStyle, setToneAndStyle] = useState('');
    const [userGuidance, setUserGuidance] = useState('');
    const [positiveReinforcement, setPositiveReinforcement] = useState('');
    const [errorHandling, setErrorHandling] = useState('');
    const [politeness, setPoliteness] = useState('');
    const [clarityAndSimplicity, setClarityAndSimplicity] = useState('');
    const [personalization, setPersonalization] = useState('');
    const [responseLength, setResponseLength] = useState('');
    const [clarificationPrompt, setClarificationPrompt] = useState('');
    const [apologyAndRetryAttempt, setApologyAndRetryAttempt] = useState('');
    const [errorMessageStyle, setErrorMessageStyle] = useState('');
    const [buttonloading, setbuttonloading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');


    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
    };
    const handleSelectionChange = (key: React.Key) => {
        setSelected(String(key));
    };


    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/customizations`, {
                shopDomain: user?.publicMetadata.shopDomain
            })
            const { settings } = res.data;
            setBotName(settings.botName);
            setFontFamily(settings.fontFamily);
            setFontColor(settings.fontColor);
            setgreetingmessage(settings.greetingMessage);
            setWidgetPosition(settings.widgetPosition);
            setToneAndStyle(settings.toneAndStyle);
            setUserGuidance(settings.userGuidance);
            setPositiveReinforcement(settings.positiveReinforcement);
            setErrorHandling(settings.errorHandling);
            setPoliteness(settings.politeness);
            setClarityAndSimplicity(settings.clarityAndSimplicity);
            setPersonalization(settings.personalization);
            setResponseLength(settings.responseLength);
            setClarificationPrompt(settings.clarificationPrompt);
            setApologyAndRetryAttempt(settings.apologyAndRetryAttempt);
            setErrorMessageStyle(settings.errorMessageStyle);
            setSelectedColor(settings.selectedColor);
            setPreviewUrl(settings.logo)

            console.log(previewUrl)

        }
        fetchData();
    }, [])

    const handleAppearanceSave = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior
        setbuttonloading(true)
        if (selectedLogo) {
            try {
                const formData = new FormData()
                formData.append('file', selectedLogo, selectedLogo.name)
                const logourl = await uploadLogo(formData, user?.publicMetadata.shopDomain)
                console.log(logourl)
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/appearance/logo`, {
                    shopDomain: user?.publicMetadata.shopDomain,
                    logourl,
                    filename: selectedLogo.name
                })
                setToast({ text: 'Changes Saved', delay: 2000 })
            } catch (error) {
                setToast({ text: 'Try after some time', delay: 2000 })
                console.log(error)
            }
        }
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/appearance`, {
                shopDomain: user?.publicMetadata.shopDomain,
                selectedColor,
                botName,
                fontFamily,
                fontColor,
                widgetPosition
            })
            setToast({ text: 'Changes Saved', delay: 2000 })
        } catch (error) {
            setToast({ text: 'Try after some time', delay: 2000 })
            console.log(error)
            // Handle error (e.g., show error message)
        }
        setbuttonloading(false)

    };
    const handlelanguageSave = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior
        setbuttonloading(true)
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/language`, {
                shopDomain: user?.publicMetadata.shopDomain,
                toneAndStyle,
                positiveReinforcement,
                errorHandling,
                politeness,
                clarityAndSimplicity,
                personalization
            })
            setToast({ text: 'Changes Saved', delay: 2000 })
        } catch (error) {
            setToast({ text: 'Try after some time', delay: 2000 })
            console.log(error)
        }
        setbuttonloading(false)

    };
    const handlebehaviourSave = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior
        setbuttonloading(true)

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/behaviour`, {
                shopDomain: user?.publicMetadata.shopDomain,
                responseLength,
                clarificationPrompt,
                apologyAndRetryAttempt,
                errorMessageStyle,
                greetingmessage
            })
            setToast({ text: 'Changes Saved', delay: 2000 })
        } catch (error) {
            setToast({ text: 'Try after some time', delay: 2000 })
            console.log(error)
        }
        setbuttonloading(false)

    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedLogo(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };



    return (
        <div>
            <div className="grid grid-cols-12 gap-4">
                <div className="flex flex-col w-full col-span-7">
                    <Card className="max-w-full ">
                        <CardBody className="overflow-hidden">
                            <Tabs
                                fullWidth
                                size="lg"
                                aria-label="Tabs form"
                                selectedKey={selected}
                                onSelectionChange={handleSelectionChange}
                                className="justify-center"
                            >
                                <Tab key="appearance" title="Appearance">
                                    <form className="flex flex-col gap-4">
                                        <Input
                                            label="Bot Name"
                                            placeholder="Name of your Bot"
                                            type="text"
                                            value={botName}
                                            onValueChange={(value) => {
                                                setBotName(value)
                                            }}
                                        />
                                        <div className="pb-4">
                                            Choose Color
                                        </div>
                                        <div className="pl-4" >
                                            <ColorPicker
                                                defaultColor={selectedColor}
                                                colors={colors}
                                                onSelect={(color) => setSelectedColor(color)} />
                                        </div>
                                        <div className="w-full flex flex-col gap-4">
                                            <div className="pt-4" >
                                                Font Settings
                                            </div>
                                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                <Select
                                                    variant="flat"
                                                    label="Font Family"
                                                    className="max-w-xs"
                                                    selectedKeys={[fontFamily]}
                                                    onSelectionChange={(keys) => {
                                                        const selectedKey = Array.from(keys)[0];
                                                        setFontFamily(String(selectedKey));
                                                    }}
                                                >
                                                    {fonts.map((fonts) => (
                                                        <SelectItem key={fonts.value} value={fonts.value}>
                                                            {fonts.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                <Select
                                                    variant="flat"
                                                    label="Font Color"
                                                    className="max-w-xs"
                                                    selectedKeys={[fontColor]}
                                                    onSelectionChange={(keys) => {
                                                        const selectedKey = Array.from(keys)[0];
                                                        setFontColor(String(selectedKey));
                                                    }}

                                                >
                                                    {color.map((color) => (
                                                        <SelectItem key={color.value} value={color.value}>
                                                            {color.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <h3 className="font-medium ">
                                                Upload Logo
                                            </h3>
                                            <div className="flex flex-col gap-5.5 p-2">
                                                <div>
                                                    <label className="mb-3 block text-sm font-medium">
                                                        Attach file
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:px-5 file:py-3  file:hover:bg-opacity-10 focus:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark"
                                                        onChange={handleLogoChange}
                                                        accept="image/*"
                                                    />

                                                    <div className="p-2">
                                                        <p>Supported Format: JPG,PNG,SVG</p>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                        <RadioGroup
                                            label="Widget Position"
                                            orientation="horizontal"
                                            value={widgetPosition}
                                            onValueChange={setWidgetPosition}
                                        >
                                            <Radio value="left">Left</Radio>
                                            <Radio value="right">Right</Radio>
                                        </RadioGroup>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                onClick={handleAppearanceSave}
                                                isLoading={buttonloading}
                                                spinner={
                                                    <div className="flex flex-row">
                                                        <svg
                                                            className="animate-spin h-5 w-5 text-current"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>

                                                        <div>   Saving Changes</div>
                                                    </div>
                                                }

                                                fullWidth color="primary">
                                                {buttonloading ? "" : "Save"}

                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                                <Tab key="language" title="Persona">
                                    <form className="flex flex-col gap-4 ">
                                        <Textarea
                                            label="Tone and Style"
                                            defaultValue={toneAndStyle}
                                            onValueChange={(value) => {
                                                setToneAndStyle(value)
                                            }}
                                        />
                                        <Textarea
                                            label="User Guidance"
                                            defaultValue={userGuidance}
                                            onValueChange={(value) => {
                                                setUserGuidance(value)
                                            }}
                                        />
                                        <Textarea
                                            label="Positive reinforcement"
                                            placeholder="Include positive phrases to acknowledge user inputs. Express gratitude and provide positive feedback where applicable to enhance user experience."
                                            defaultValue={positiveReinforcement}
                                            onValueChange={(value) => {
                                                setPositiveReinforcement(value)
                                            }}
                                        />
                                        <Textarea
                                            label="Error Handling"
                                            placeholder="Clearly communicate errors with user-friendly messages. Provide suggestions for correction and avoid technical jargon. Apologize when necessary."
                                            defaultValue={errorHandling}
                                            onValueChange={(value) => {
                                                setErrorHandling(value)
                                            }}

                                        />
                                        <Textarea
                                            label="Politeness"
                                            placeholder="Always use polite phrases and courteous language. Avoid language that may be perceived as rude or insensitive. Thank users for their inputs."
                                            defaultValue={politeness}
                                            onValueChange={(value) => {
                                                setPoliteness(value)
                                            }}

                                        />
                                        <Textarea
                                            label="Clarity and simplicity"
                                            placeholder="Prioritize straightforward language. Avoid complex jargon and use concise sentences. Break down information into easily digestible chunks."
                                            defaultValue={clarityAndSimplicity}
                                            onValueChange={(value) => {
                                                setToneAndStyle(value)
                                            }}
                                        />
                                        <Textarea
                                            label="Personalization"
                                            placeholder="Address users by name whenever possible. Reference past interactions to create a personalized experience. Use personalized greetings based on user history."
                                            defaultValue={personalization}
                                            onValueChange={(value) => {
                                                setPersonalization(value)
                                            }}

                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                onClick={handlelanguageSave}
                                                isLoading={buttonloading}
                                                spinner={
                                                    <div className="flex flex-row">
                                                        <svg
                                                            className="animate-spin h-5 w-5 text-current"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                        <h1>   Saving Changes</h1>
                                                    </div>
                                                }
                                                fullWidth color="primary">
                                                {buttonloading ? "" : "Save"}
                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                                <Tab key="behavioral" title="Behavioral Theme">
                                    <form className="flex flex-col gap-4 ">
                                        <div>
                                            <div className="text-2xl font-bold">Response Length</div>
                                        </div>
                                        <Tabs
                                            selectedKey={responseLength}
                                            onSelectionChange={(key: React.Key) => {
                                                setResponseLength(String(key))
                                            }}
                                            key="bordered"
                                            variant="bordered"
                                            aria-label="Tabs variants">
                                            <Tab key="Short" title="Short" />
                                            <Tab key="Medium" title="Medium" />
                                            <Tab key="Long" title="Long" />
                                        </Tabs>
                                        <Textarea
                                            label="Greeting Message"
                                            placeholder="Hi There, How May I help you?"
                                            defaultValue={greetingmessage}
                                            onValueChange={(value) => {
                                                setgreetingmessage(value)
                                            }}
                                        />
                                        <Textarea
                                            label="Clarification Prompt"
                                            defaultValue={clarificationPrompt}
                                            onValueChange={(value) => {
                                                setClarificationPrompt(value)
                                            }}


                                        />
                                        <Textarea
                                            label="Apology and Retry Attempt"
                                            defaultValue={apologyAndRetryAttempt}
                                            onValueChange={(value) => {
                                                setApologyAndRetryAttempt(value)
                                            }}

                                        />
                                        <div>
                                            <div className="text-2xl font-bold">Error Message Style</div>
                                        </div>
                                        <Tabs
                                            selectedKey={errorMessageStyle}
                                            onSelectionChange={(key: React.Key) => {
                                                setErrorMessageStyle(String(key))
                                            }}
                                            key="bordered" variant="bordered" aria-label="Tabs variants">
                                            <Tab key="Humorous" title="Humorous" />
                                            <Tab key="Standard" title="Standard" />
                                            <Tab key="Casual" title="Casual" />
                                            <Tab key="Formal" title="Formal" />
                                            <Tab key="Empathetic" title="Empathetic" />
                                        </Tabs>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                isLoading={buttonloading}
                                                onClick={handlebehaviourSave}
                                                spinner={
                                                    <div className="flex flex-row">
                                                        <svg
                                                            className="animate-spin h-5 w-5 text-current"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                        <h1>Saving Changes</h1>
                                                    </div>
                                                }
                                                fullWidth color="primary">
                                                {buttonloading ? "" : "Save"}
                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
                <div className="flex flex-col  col-span-5 max-w-[400px]">
                    {isOpen ? (
                        <div
                            style={{ fontFamily: fontFamily }}
                            className="max-w-full h-[500px] shadow-xl bg-white rounded-2xl">
                            <div className="h-[75px]  grid grid-cols-8 items-center rounded-t-2xl"
                                style={{
                                    backgroundColor: selectedColor,
                                    color: fontColor
                                }}>
                                <div className="col-span-2 pl-4 rounded-full">
                                    <Image
                                        loader={() => previewUrl}
                                        src={previewUrl}
                                        width={54}
                                        height={50}
                                        alt="User"
                                    />
                                </div>
                                <div className="bg-transaparent col-span-5">
                                    <h1 className="text-3xl font-bold p-4 ">
                                        {botName}
                                    </h1>
                                </div>
                                <div className="col-span-1" onClick={toggleChatWindow}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div
                                className="h-[360px]  flex flex-col bg-white p-3 overflow-auto scrollbar-custom">
                                {demo_mssgs.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`pt-2 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                                            }`}
                                    >
                                        <Card className="max-w-[230px]">
                                            <CardBody className="">
                                                {message}
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white rounded-r-3xl rounded-l-3xl pl-2 pr-2 "
                                style={{
                                    color: fontColor
                                }}>
                                <div className="col-span-8 ">
                                    <div className={styles.chatInput}
                                        style={{
                                            borderColor: selectedColor,
                                            borderWidth: 2,
                                        }}
                                    >
                                        <div className="rounded-3xl w-full">
                                            <input
                                                disabled={true}
                                                type="text" placeholder="Type here..." />
                                        </div>
                                        <div className="pl-2">
                                            <button className={styles.sendButton}
                                                style={{
                                                    backgroundColor: selectedColor
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                </svg>


                                            </button>
                                        </div>



                                    </div>

                                    <div className={styles.branding}>
                                        <p>
                                            Powered by <span style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 600 }}>Yugaa</span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{ fontFamily: fontFamily }}
                                className="max-w-full h-[500px] bg-transparent rounded-2xl">
                            </div>
                            <button onClick={toggleChatWindow} className="">
                                <svg viewBox="365.2858 94.3645 214.3469 195.7795" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <filter id="dropshadow" height="130%">
                                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                            <feOffset dx="2" dy="2" result="offsetblur" />
                                            <feFlood floodColor="black" floodOpacity="0.5" />
                                            <feComposite in2="offsetblur" operator="in" />
                                            <feMerge>
                                                <feMergeNode />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <path filter="url(#dropshadow)" d="M 473.411 98.803 C 473.988 98.804 473.988 98.804 474.576 98.805 C 480.277 98.823 485.825 99.008 491.435 100.014 C 491.97 100.103 491.97 100.103 492.515 100.193 C 511.427 103.34 528.534 111.561 542.664 123.424 C 543.364 124.004 544.073 124.552 544.812 125.089 C 545.975 126.017 546.938 126.999 547.932 128.074 C 548.789 128.986 549.682 129.856 550.578 130.734 C 562.576 142.884 570.312 158.41 573.898 174.391 C 573.956 174.65 574.016 174.911 574.076 175.179 C 575.263 180.899 575.514 186.617 575.49 192.425 C 575.489 192.956 575.489 192.956 575.487 193.497 C 575.469 198.738 575.267 203.838 574.171 208.996 C 574.107 209.325 574.044 209.652 573.977 209.991 C 570.556 227.377 561.613 243.104 548.71 256.096 C 548.079 256.741 547.483 257.391 546.899 258.07 C 545.891 259.14 544.822 260.025 543.651 260.94 C 542.661 261.726 541.713 262.55 540.759 263.373 C 527.545 274.403 510.655 281.515 493.274 284.812 C 492.991 284.867 492.708 284.921 492.418 284.976 C 486.196 286.067 479.976 286.298 473.659 286.276 C 473.273 286.275 472.888 286.274 472.492 286.274 C 466.797 286.254 461.234 286.109 455.635 285.064 C 455.032 284.955 455.032 284.955 454.417 284.843 C 444.311 282.974 433.45 280.251 424.71 275.047 C 422.502 274.043 420.387 274.839 418.138 275.513 C 417.421 275.725 417.421 275.725 416.69 275.943 C 416.172 276.098 415.655 276.255 415.137 276.41 C 414.591 276.574 414.045 276.737 413.498 276.899 C 412.056 277.329 410.614 277.764 409.173 278.197 C 407.754 278.623 406.334 279.046 404.914 279.471 C 404.351 279.639 403.788 279.808 403.227 279.976 C 402.098 280.312 400.973 280.648 399.844 280.983 C 397.295 281.743 394.746 282.509 392.209 283.307 C 391.101 283.656 389.991 283.996 388.88 284.339 C 388.116 284.577 387.356 284.822 386.595 285.067 C 383.075 286.147 379.491 286.853 375.882 285.727 C 373.943 284.435 372.483 283.151 371.705 281.04 C 371.401 277.783 371.907 275.051 373.075 271.988 C 373.22 271.592 373.364 271.194 373.511 270.786 C 373.82 269.939 374.132 269.094 374.447 268.249 C 374.943 266.923 375.429 265.592 375.912 264.261 C 376.571 262.448 377.233 260.634 377.896 258.823 C 379.208 255.239 380.493 251.65 381.754 248.052 C 382.115 247.025 382.483 246.001 382.852 244.976 C 383.07 244.354 383.288 243.732 383.506 243.108 C 383.608 242.833 383.707 242.555 383.811 242.27 C 384.674 239.764 384.309 238.21 383.011 235.912 C 382.873 235.674 382.735 235.436 382.594 235.19 C 382.302 234.666 382.011 234.141 381.721 233.616 C 381.575 233.35 381.428 233.086 381.277 232.813 C 377.178 225.294 374.534 217.255 372.898 208.996 C 372.833 208.691 372.768 208.385 372.701 208.07 C 370.596 197.933 370.75 186.199 372.898 176.082 C 372.994 175.59 372.994 175.59 373.092 175.088 C 376.513 157.701 385.455 141.974 398.36 128.984 C 398.991 128.338 399.586 127.688 400.17 127.009 C 401.179 125.939 402.247 125.054 403.418 124.139 C 404.409 123.351 405.357 122.53 406.31 121.706 C 419.525 110.675 436.414 103.563 453.796 100.266 C 454.078 100.213 454.361 100.158 454.652 100.103 C 460.873 99.011 467.094 98.781 473.411 98.803 Z"
                                        fill={selectedColor} transform="matrix(1, 0, 0, 1, -2.842170943040401e-14, -1.4210854715202004e-14)" />
                                    {/* <path d="M 472.527 94.366 C 473.132 94.367 473.132 94.367 473.749 94.368 C 479.731 94.386 485.552 94.58 491.438 95.631 C 491.999 95.724 491.999 95.724 492.571 95.818 C 512.415 99.103 530.363 107.688 545.189 120.075 C 545.924 120.68 546.667 121.252 547.442 121.813 C 548.663 122.782 549.673 123.807 550.717 124.93 C 551.616 125.882 552.553 126.791 553.493 127.708 C 566.082 140.394 574.198 156.607 577.961 173.293 C 578.022 173.564 578.084 173.836 578.148 174.115 C 579.393 180.089 579.657 186.059 579.631 192.123 C 579.63 192.678 579.63 192.678 579.628 193.243 C 579.609 198.716 579.397 204.041 578.248 209.427 C 578.18 209.77 578.114 210.112 578.044 210.465 C 574.454 228.62 565.071 245.042 551.532 258.607 C 550.871 259.28 550.246 259.96 549.633 260.669 C 548.575 261.786 547.454 262.71 546.225 263.665 C 545.186 264.487 544.192 265.346 543.19 266.205 C 529.325 277.723 511.604 285.149 493.368 288.592 C 493.071 288.649 492.774 288.705 492.469 288.763 C 485.941 289.903 479.415 290.144 472.787 290.12 C 472.382 290.119 471.978 290.118 471.562 290.118 C 465.587 290.098 459.75 289.947 453.876 288.855 C 453.242 288.741 453.242 288.741 452.598 288.625 C 441.994 286.672 430.599 283.829 421.428 278.396 C 419.111 277.347 416.892 278.178 414.532 278.882 C 413.78 279.104 413.78 279.104 413.013 279.331 C 412.47 279.493 411.927 279.657 411.384 279.819 C 410.811 279.99 410.237 280.16 409.664 280.33 C 408.151 280.779 406.638 281.232 405.126 281.684 C 403.637 282.129 402.147 282.571 400.657 283.014 C 400.067 283.19 399.477 283.366 398.887 283.542 C 397.703 283.893 396.522 284.244 395.338 284.594 C 392.663 285.387 389.989 286.187 387.327 287.02 C 386.164 287.384 385 287.74 383.834 288.098 C 383.033 288.346 382.235 288.602 381.437 288.858 C 377.744 289.985 373.983 290.723 370.196 289.547 C 368.162 288.198 366.63 286.857 365.813 284.654 C 365.495 281.252 366.025 278.4 367.251 275.201 C 367.403 274.788 367.554 274.373 367.709 273.946 C 368.033 273.062 368.36 272.18 368.691 271.297 C 369.211 269.912 369.721 268.523 370.227 267.133 C 370.919 265.24 371.613 263.346 372.31 261.455 C 373.686 257.713 375.034 253.965 376.357 250.208 C 376.736 249.136 377.122 248.066 377.509 246.996 C 377.738 246.346 377.967 245.697 378.195 245.046 C 378.302 244.758 378.407 244.468 378.516 244.17 C 379.421 241.554 379.038 239.931 377.676 237.532 C 377.532 237.283 377.387 237.034 377.239 236.778 C 376.932 236.231 376.627 235.683 376.322 235.134 C 376.169 234.857 376.015 234.581 375.857 234.296 C 371.556 226.444 368.782 218.05 367.065 209.427 C 366.997 209.108 366.929 208.789 366.858 208.46 C 364.65 197.875 364.812 185.622 367.065 175.059 C 367.166 174.545 367.166 174.545 367.269 174.021 C 370.859 155.866 380.241 139.444 393.781 125.88 C 394.443 125.206 395.067 124.526 395.68 123.818 C 396.739 122.701 397.859 121.776 399.088 120.821 C 400.127 119.999 401.122 119.141 402.123 118.281 C 415.988 106.763 433.708 99.337 451.946 95.894 C 452.242 95.838 452.539 95.781 452.844 95.724 C 459.372 94.583 465.899 94.343 472.527 94.366 Z M 455.545 110.905 C 455.193 110.972 454.84 111.037 454.477 111.105 C 443.077 113.252 431.607 117.189 422.157 123.508 C 421.872 123.697 421.588 123.886 421.297 124.082 C 417.983 126.315 414.764 128.612 411.75 131.178 C 410.97 131.839 410.171 132.461 409.349 133.078 C 407.737 134.337 406.403 135.772 405.045 137.254 C 404.566 137.763 404.566 137.763 404.08 138.281 C 391.302 152.017 382.61 169.688 382.408 187.934 C 382.404 188.241 382.4 188.548 382.396 188.865 C 382.228 204.794 385.575 218.984 393.888 233.075 C 394.178 233.572 394.178 233.572 394.475 234.081 C 394.821 234.663 395.178 235.241 395.549 235.811 C 397.06 238.24 397.077 240.455 396.361 243.158 C 395.875 244.634 395.35 246.094 394.81 247.554 C 394.614 248.095 394.42 248.637 394.227 249.18 C 393.717 250.598 393.201 252.015 392.683 253.431 C 391.856 255.697 391.039 257.965 390.223 260.233 C 389.939 261.019 389.652 261.803 389.364 262.588 C 388.41 265.208 387.581 267.794 387.099 270.525 C 390.356 270.02 393.424 269.18 396.554 268.224 C 397.294 268 397.294 268 398.051 267.772 C 399.353 267.38 400.655 266.986 401.956 266.59 C 403.786 266.034 405.617 265.481 407.449 264.928 C 408.42 264.636 409.39 264.341 410.361 264.046 C 420.87 260.862 420.87 260.862 425.261 262.84 C 426.616 263.492 427.95 264.176 429.285 264.861 C 437.55 269.085 446.261 271.907 455.545 273.58 C 455.861 273.642 456.179 273.704 456.506 273.768 C 466.959 275.766 479.342 275.636 489.769 273.58 C 490.12 273.514 490.472 273.449 490.836 273.382 C 502.236 271.233 513.708 267.297 523.157 260.978 C 523.583 260.694 523.583 260.694 524.016 260.404 C 527.33 258.171 530.55 255.875 533.563 253.308 C 534.343 252.647 535.143 252.026 535.965 251.408 C 537.576 250.149 538.911 248.715 540.268 247.232 C 540.587 246.893 540.906 246.554 541.234 246.206 C 554.008 232.472 562.775 214.738 562.89 196.486 C 562.893 196.173 562.897 195.86 562.899 195.538 C 562.906 194.535 562.909 193.532 562.91 192.529 C 562.91 192.186 562.91 191.844 562.91 191.491 C 562.904 186.434 562.721 181.546 561.554 176.587 C 561.483 176.265 561.41 175.942 561.337 175.61 C 558.989 165.18 554.687 154.683 547.781 146.037 C 547.47 145.648 547.47 145.648 547.153 145.251 C 544.712 142.22 542.202 139.274 539.398 136.517 C 538.676 135.802 537.996 135.07 537.321 134.319 C 535.946 132.845 534.378 131.624 532.755 130.381 C 532.385 130.09 532.015 129.798 531.634 129.498 C 516.624 117.81 497.242 109.788 477.293 109.683 C 476.952 109.68 476.61 109.677 476.257 109.675 C 475.162 109.668 474.065 109.665 472.97 109.664 C 472.594 109.664 472.22 109.664 471.834 109.664 C 466.308 109.671 460.965 109.837 455.545 110.905 Z"
                   fill={fontColor === "White" ? "#ffffff" : "#000000"} transform="matrix(1, 0, 0, 1, -2.842170943040401e-14, -1.4210854715202004e-14)" /> */}
                                    <path d="M 519.218 183.341 C 521.809 184.782 523.862 186.924 524.827 189.57 C 525.086 192.638 525.236 195.425 523.157 197.971 C 521.243 199.998 519.025 201.668 516.031 201.881 C 512.187 201.953 509.894 201.655 506.984 199.355 C 504.348 196.542 503.808 194.559 503.841 190.916 C 504.082 188.151 505.434 186.394 507.714 184.605 C 511.01 182.435 515.386 181.675 519.218 183.341 Z"
                                        fill={fontColor === "White" ? "#ffffff" : "#000000"} transform="matrix(1, 0, 0, 1, -2.842170943040401e-14, -1.4210854715202004e-14)" />
                                    <path d="M 477.483 183.341 C 480.075 184.782 482.126 186.924 483.091 189.57 C 483.35 192.638 483.5 195.425 481.421 197.971 C 479.509 199.998 477.289 201.668 474.295 201.881 C 470.452 201.953 468.158 201.655 465.249 199.355 C 462.612 196.542 462.072 194.559 462.106 190.916 C 462.346 188.151 463.698 186.394 465.978 184.605 C 469.274 182.435 473.651 181.675 477.483 183.341 Z"
                                        fill={fontColor === "White" ? "#ffffff" : "#000000"} transform="matrix(1, 0, 0, 1, -2.842170943040401e-14, -1.4210854715202004e-14)" />
                                    <path d="M 435.747 183.341 C 438.339 184.782 440.39 186.924 441.355 189.57 C 441.614 192.638 441.764 195.425 439.685 197.971 C 437.773 199.998 435.553 201.668 432.559 201.881 C 428.716 201.953 426.422 201.655 423.513 199.355 C 420.878 196.542 420.336 194.559 420.37 190.916 C 420.61 188.151 421.964 186.394 424.244 184.605 C 427.54 182.435 431.915 181.675 435.747 183.341 Z"
                                        fill={fontColor === "White" ? "#ffffff" : "#000000"} transform="matrix(1, 0, 0, 1, -2.842170943040401e-14, -1.4210854715202004e-14)" />
                                </svg>
                            </button>
                        </div>
                    )}

                </div>
            </div>
            <style jsx>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 #F3F4F6;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 12px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #F3F4F6;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 9999px;
          border: 3px solid #F3F4F6;
        }
        .chatbot-icon {
          width: 54px; /* Set the width of the icon */
          height: 50px; /* Set the height of the icon */
          background-color: red; /* Set your desired color */
          background-blend-mode: multiply; /* Blend the color with the icon */
          background-repeat: no-repeat;
          background-size: contain; /* This ensures the image covers the content box */
          border-radius: 50%; /* This can make it round if you want */
        }
        
      `}</style>
        </div>

    );
};

export default TablesPage;
