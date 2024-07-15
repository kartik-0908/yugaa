// "use client"
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AuthWrapper from "../../AuthWrapper";
// import Loader from "@/components/common/Loader";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { Suspense } from 'react'



const Upgrade = () => {
//   const router = useRouter();
 

//   const [selectedCard, setSelectedCard] = useState<number>(0);
//   const [convleft, setconvleft] = useState<number>(0);
//   const [pageloading, setpageloading] = useState(true);
//   const [button1loading, setbutton1loading] = useState(false);
//   const [button2loading, setbutton2loading] = useState(false);
//   const [cancelbuttonloading, setcanelbuttonloading] = useState(false)
//   const [currentPlan, setcurrentPlan] = useState(0)

//   const handleSave = async (e: any) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     if ((selectedCard) === currentPlan) {
//       return;
//     }
//     if (selectedCard === 1) {
//       setbutton1loading(true)
//     }
//     else {
//       setbutton2loading(true);
//     }

//     try {
//       let dollar, plan_name;
//       if (selectedCard === 1) {
//         dollar = 69;
//         plan_name = "Basic Plan for Yugaa"
//       }
//       else if (selectedCard === 2) {
//         dollar = 99;
//         plan_name = "Pro Plan for Yugaa"
//       }

//       const response = await axios.post('api/v1/data/upgrade', {
//         dollar: dollar,
//         plan_name: plan_name
//       });
//       const data = response.data;
//       const { url } = data;
//       router.push(url)
//       // console.log('Success:', data);
//     } catch (error) {
//     }

//   };

//   const handleCancel = async (e: any) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setcanelbuttonloading(true)
//     try {
//       const response = await axios.post('api/v1/data/cancel');
//       // const data = response.data;
//       setTimeout(() => {
//         window.location.reload();
//         setcanelbuttonloading(false)

//       }, 2000);
//       // console.log('Success:', data);
//     } catch (error) {
//       setcanelbuttonloading(false)
//     }

//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get('/api/v1/data/upgrade')
//       console.log(res.data);
//       setcurrentPlan(res.data.plan)
//       setSelectedCard(res.data.plan)
//       setconvleft(res.data.convleft)
//       setpageloading(false)
//     }
//     fetchData();
//   }, [])

//   return (
//     <Suspense>
//       <AuthWrapper>
//         {pageloading ?
//           <Loader />
//           :
//           <DefaultLayout>
//             <div className="mx-auto max-w-270">
//               <Breadcrumb pageName="Upgrade" />

//               <div className="col-span-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//                 <div className="col-span-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//                   <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
//                     <div className="text-3xl font-bold text-center text-black dark:text-white">
//                       Current Subscription Plan: {currentPlan === 0 ? "None" : currentPlan === 1 ? "Basic" : "Pro"}
//                     </div>
//                     <div className="text-xl text-center text-black dark:text-white">
//                       Number of conversations left for this billing cycle: {convleft}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-12 gap-8 pt-8">
//                 {/* <div className="col-span-4">
//                 <Card
//                   isPressable
//                   onPress={() => {
//                     setSelectedCard(0);
//                   }}
//                   className={selectedCard === 0 ? "border-2 border-blue-500" : ""}
//                 >
//                   <CardHeader className=" gap-3">
//                     <div className="w-full ">
//                       <div className="text-2xl font-bold">
//                         Free Plan
//                       </div>
//                       <div className="">
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <Divider />
//                   <CardBody
//                     className="p-8 gap-6 text-2xl"
//                   >
//                     <div>
//                       50 Conversations/month
//                     </div>
//                     <div>
//                       GPT-3.5 Turbo Powered Chatbot
//                     </div>
//                     <div>
//                       Widget Customizations
//                     </div>
//                     <div>
//                       Live Bot Analytics
//                     </div>
//                     <div>
//                       Multi-Lingual Bot
//                     </div>
//                   </CardBody>
//                   <Divider />

//                 </Card>
//               </div> */}
//                 <div className="col-span-6">
//                   <Card
//                     isPressable
//                     onPress={() => {
//                       setSelectedCard(1);
//                     }}
//                     className={selectedCard === 1 ? "border-2 border-blue-500" : ""}
//                   >
//                     <CardHeader className=" gap-3">
//                       <div className="w-full ">
//                         <div className="text-2xl font-bold">
//                           $69/ month

//                         </div>
//                         <div className="">
//                           Select this to get Basic Plan for yourself
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <Divider />
//                     <CardBody
//                       className="p-8 gap-6 text-2xl"
//                     >
//                       <div>
//                         1500 Conversations/month
//                       </div>
//                       <div>
//                         GPT-3.5 Turbo Powered Chatbot
//                       </div>
//                       <div>
//                         Widget Customizations
//                       </div>
//                       <div>
//                         Live Bot Analytics
//                       </div>
//                       {/* <div>
//                  2 Page Ingestion
//                </div> */}
//                       <div>
//                         Multi-Lingual Bot
//                       </div>
//                       <div>
//                         Support Over email
//                       </div>
//                     </CardBody>
//                     <Divider />
//                     <CardFooter>
//                       <div className="w-full">
//                         {(currentPlan) === 1 ? (
//                           <Button
//                             color="primary"
//                             onClick={handleCancel}
//                             isLoading={cancelbuttonloading}
//                           >Cancel Subscription</Button>
//                         ) :
//                           (selectedCard) !== 1 ? (
//                             <Button disabled>Buy Plan</Button>
//                           ) :
//                             (
//                               <Button
//                                 onClick={handleSave}
//                                 isLoading={button1loading}
//                                 disableAnimation
//                                 className="bg-blue-500 text-white"
//                                 isDisabled={selectedCard !== 1}
//                                 spinner={
//                                   <div className="flex flex-row">
//                                     <svg
//                                       className="animate-spin h-5 w-5 text-current"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                       />
//                                       <path
//                                         className="opacity-75"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                         fill="currentColor"
//                                       />
//                                     </svg>
//                                     <h1>Redirecting to Shopify</h1>
//                                   </div>
//                                 }
//                                 color={"primary"}
//                               >
//                                 Buy  Plan
//                               </Button>
//                             )}
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 </div>
//                 <div className="col-span-6">
//                   <Card
//                     isPressable
//                     onPress={() => {
//                       setSelectedCard(2);
//                     }}
//                     className={selectedCard === 2 ? "border-2 border-blue-500" : ""}
//                   >
//                     <CardHeader className="flex gap-3">
//                       <div className="w-full ">
//                         <div className="text-2xl font-bold">
//                           $99/ month

//                         </div>
//                         <div className="">
//                           Select this to get Pro Plan for yourself
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <Divider />
//                     <CardBody
//                       className="p-8 gap-6 text-2xl"
//                     >
//                       <div>
//                         2500 Conversations/month
//                       </div>
//                       <div>
//                         All features of Basic Plan
//                       </div>
//                       <div>
//                         Widget Customizations
//                       </div>
//                       <div>
//                         No Yugaa Branding
//                       </div>
//                       {/* <div>
//                  Unlimited Page Ingestion
//                </div> */}
//                       <div>
//                         Highest Priority Access
//                       </div>
//                       <div>
//                         Early access to updates
//                       </div>
//                       <div>
//                         Dedicated Account Manager
//                       </div>
//                       <div>
//                         Round the Clock chat suppport (Whatsapp, Slack, Teams)
//                       </div>
//                     </CardBody>
//                     <Divider />
//                     <CardFooter>
//                       <div className="w-full">
//                         {(currentPlan) === 2 ? (
//                           <Button
//                             color="primary"
//                             onClick={handleCancel}
//                             isLoading={cancelbuttonloading}

//                           >Cancel Subscription</Button>
//                         ) :
//                           (selectedCard) !== 2 ? (
//                             <Button disabled>Buy Plan</Button>
//                           ) :
//                             (
//                               <Button
//                                 onClick={handleSave}
//                                 isLoading={button2loading}
//                                 disableAnimation
//                                 className="bg-blue-500 text-white"
//                                 isDisabled={selectedCard !== 2}
//                                 spinner={
//                                   <div className="flex flex-row">
//                                     <svg
//                                       className="animate-spin h-5 w-5 text-current"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                       />
//                                       <path
//                                         className="opacity-75"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                         fill="currentColor"
//                                       />
//                                     </svg>
//                                     <h1>Redirecting to Shopify</h1>
//                                   </div>
//                                 }
//                                 color={"primary"}
//                               >
//                                 Buy  Plan
//                               </Button>
//                             )}
//                       </div>
//                     </CardFooter>
//                   </Card>

//                 </div>



//               </div>

//             </div>
//           </DefaultLayout>
//         }

//       </AuthWrapper>
//     </Suspense>
//   );
};

export default Upgrade;
