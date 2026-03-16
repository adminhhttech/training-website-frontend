// components/instructor/tabs/SettingsTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Mail, Bell, Shield, Palette, X } from "lucide-react"

interface UserData {
    name?: string
    bio?: string
    email?: string
    phone?: string
    website?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    avatar?: string
}

interface SettingsTabProps {
    userData: UserData
}

export const SettingsTab = ({ userData }: SettingsTabProps) => {
    const [profileForm, setProfileForm] = useState({
        firstName: userData?.name?.split(" ")[0] || "",
        lastName: userData?.name?.split(" ")[1] || "",
        bio: userData?.bio || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        website: userData?.website || "",
        linkedin: userData?.linkedin || "",
        youtube: userData?.youtube || "",
        twitter: userData?.twitter || "",
        avatar: userData?.avatar || ""
    })

    const [courseDefaults, setCourseDefaults] = useState({
        defaultLevel: "Beginner",
        defaultLanguage: "English",
        defaultPrice: 0,
        defaultCategory: "web-development",
        showPriceByDefault: true,
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: {
            newEnrollment: true,
            newReview: true,
            newQuestion: true,
            newMessage: true,
            payoutProcessed: true,
        },
        pushNotifications: {
            newEnrollment: false,
            newReview: false,
            newQuestion: false,
            newMessage: false,
            payoutProcessed: false,
        },
    })

    const [branding, setBranding] = useState({
        brandColor: "#0080ff",
        watermark: "",
        showWatermark: true,
    })

    const handleSaveProfile = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log("Profile saved:", profileForm)
        } catch (error) {
            console.error("Error saving profile:", error)
        }
    }

    const handleSaveCourseDefaults = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log("Course defaults saved:", courseDefaults)
        } catch (error) {
            console.error("Error saving course defaults:", error)
        }
    }

    const handleSaveNotifications = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log("Notifications saved:", notificationSettings)
        } catch (error) {
            console.error("Error saving notifications:", error)
        }
    }

    const handleSaveBranding = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log("Branding saved:", branding)
        } catch (error) {
            console.error("Error saving branding:", error)
        }
    }

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const result = event.target?.result as string
                setProfileForm({ ...profileForm, avatar: result })
            }
            reader.readAsDataURL(file)
        }
    }

    const updateEmailNotification = (key: keyof typeof notificationSettings.emailNotifications, value: boolean) => {
        setNotificationSettings({
            ...notificationSettings,
            emailNotifications: {
                ...notificationSettings.emailNotifications,
                [key]: value
            }
        })
    }

    const updatePushNotification = (key: keyof typeof notificationSettings.pushNotifications, value: boolean) => {
        setNotificationSettings({
            ...notificationSettings,
            pushNotifications: {
                ...notificationSettings.pushNotifications,
                [key]: value
            }
        })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="course-defaults">Course Defaults</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={profileForm.firstName}
                                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={profileForm.lastName}
                                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself"
                                    rows={4}
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                                    onClick={handleSaveProfile}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Course Defaults Tab */}
                <TabsContent value="course-defaults" className="space-y-6">
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Course Defaults</CardTitle>
                            <CardDescription>Set default values for new courses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultLevel">Default Level</Label>
                                    <Select
                                        value={courseDefaults.defaultLevel}
                                        onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setCourseDefaults({ ...courseDefaults, defaultLevel: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="defaultLanguage">Default Language</Label>
                                    <Select
                                        value={courseDefaults.defaultLanguage}
                                        onValueChange={(value) => setCourseDefaults({ ...courseDefaults, defaultLanguage: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                            <SelectItem value="Chinese">Chinese</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultPrice">Default Price ($)</Label>
                                    <Input
                                        id="defaultPrice"
                                        type="number"
                                        placeholder="0.00"
                                        value={courseDefaults.defaultPrice}
                                        onChange={(e) => setCourseDefaults({ ...courseDefaults, defaultPrice: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="defaultCategory">Default Category</Label>
                                    <Select
                                        value={courseDefaults.defaultCategory}
                                        onValueChange={(value) => setCourseDefaults({ ...courseDefaults, defaultCategory: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="web-development">Web Development</SelectItem>
                                            <SelectItem value="mobile-development">Mobile Development</SelectItem>
                                            <SelectItem value="data-science">Data Science</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showPrice"
                                    checked={courseDefaults.showPriceByDefault}
                                    onChange={(e) => setCourseDefaults({ ...courseDefaults, showPriceByDefault: e.target.checked })}
                                />
                                <Label htmlFor="showPrice" className="text-sm">Show price by default</Label>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                                    onClick={handleSaveCourseDefaults}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-gray-900 mb-3">Email Notifications</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="newEnrollment"
                                            checked={notificationSettings.emailNotifications.newEnrollment}
                                            onChange={(e) => updateEmailNotification('newEnrollment', e.target.checked)}
                                        />
                                        <Label htmlFor="newEnrollment" className="text-sm">New student enrollment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="newReview"
                                            checked={notificationSettings.emailNotifications.newReview}
                                            onChange={(e) => updateEmailNotification('newReview', e.target.checked)}
                                        />
                                        <Label htmlFor="newReview" className="text-sm">New course review</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="newQuestion"
                                            checked={notificationSettings.emailNotifications.newQuestion}
                                            onChange={(e) => updateEmailNotification('newQuestion', e.target.checked)}
                                        />
                                        <Label htmlFor="newQuestion" className="text-sm">New course question</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="newMessage"
                                            checked={notificationSettings.emailNotifications.newMessage}
                                            onChange={(e) => updateEmailNotification('newMessage', e.target.checked)}
                                        />
                                        <Label htmlFor="newMessage" className="text-sm">New message from student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="payoutProcessed"
                                            checked={notificationSettings.emailNotifications.payoutProcessed}
                                            onChange={(e) => updateEmailNotification('payoutProcessed', e.target.checked)}
                                        />
                                        <Label htmlFor="payoutProcessed" className="text-sm">Payout processed</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-gray-900 mb-3">Push Notifications</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pushNewEnrollment"
                                            checked={notificationSettings.pushNotifications.newEnrollment}
                                            onChange={(e) => updatePushNotification('newEnrollment', e.target.checked)}
                                        />
                                        <Label htmlFor="pushNewEnrollment" className="text-sm">New student enrollment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pushNewReview"
                                            checked={notificationSettings.pushNotifications.newReview}
                                            onChange={(e) => updatePushNotification('newReview', e.target.checked)}
                                        />
                                        <Label htmlFor="pushNewReview" className="text-sm">New course review</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pushNewQuestion"
                                            checked={notificationSettings.pushNotifications.newQuestion}
                                            onChange={(e) => updatePushNotification('newQuestion', e.target.checked)}
                                        />
                                        <Label htmlFor="pushNewQuestion" className="text-sm">New course question</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pushNewMessage"
                                            checked={notificationSettings.pushNotifications.newMessage}
                                            onChange={(e) => updatePushNotification('newMessage', e.target.checked)}
                                        />
                                        <Label htmlFor="pushNewMessage" className="text-sm">New message from student</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                                    onClick={handleSaveNotifications}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-6">
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Customize your instructor profile appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <Label htmlFor="brandColor">Brand Color</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="color"
                                        id="brandColor"
                                        value={branding.brandColor}
                                        onChange={(e) => setBranding({ ...branding, brandColor: e.target.value })}
                                        className="w-16 h-10"
                                    />
                                    <span className="text-sm text-gray-600">{branding.brandColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="watermark">Course Watermark</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                                    {branding.watermark ? (
                                        <div className="relative">
                                            <img
                                                src={branding.watermark}
                                                alt="Course watermark"
                                                className="h-32 w-full object-contain rounded"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => setBranding({ ...branding, watermark: "" })}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 mb-2">Click to upload watermark image</p>
                                            <Button variant="outline" className="mt-2">
                                                Select File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="showWatermark"
                                        checked={branding.showWatermark}
                                        onChange={(e) => setBranding({ ...branding, showWatermark: e.target.checked })}
                                    />
                                    <Label htmlFor="showWatermark" className="text-sm">Show watermark on videos</Label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                                    onClick={handleSaveBranding}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
                <Button
                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                    onClick={() => {
                        // Save all settings
                        handleSaveProfile()
                        handleSaveCourseDefaults()
                        handleSaveNotifications()
                        handleSaveBranding()
                    }}
                >
                    Save All Changes
                </Button>
            </div>
        </div>
    )
}