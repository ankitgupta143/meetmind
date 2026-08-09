"use client"; import { toast } from "sonner"; import SocialButton from "./SocialButton";
export default function OAuthButtons(){return <div className="flex gap-3"><SocialButton provider="Google" onClick={()=>toast.info('Google sign-in will be enabled with the backend.')} /><SocialButton provider="GitHub" onClick={()=>toast.info('GitHub sign-in will be enabled with the backend.')} /></div>}
