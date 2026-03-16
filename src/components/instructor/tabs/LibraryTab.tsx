// components/instructor/tabs/LibraryTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Filter, Download, Eye, Copy, Trash2, MoreVertical, FileText, Video, FolderOpen } from "lucide-react"

interface Asset {
    id: string
    name: string
    type: "video" | "image" | "document" | "audio" | "zip" | "other"
    size: number
    url: string
    thumbnailUrl?: string
    tags: string[]
    folder?: string
    uploadedAt: string
}

const mockAssets: Asset[] = [
    {
        id: "1",
        name: "React Introduction.mp4",
        type: "video",
        size: 245760000,
        url: "https://example.com/react-intro.mp4",
        thumbnailUrl: "/thumbnail-1.jpg",
        tags: ["react", "introduction"],
        folder: "React for Beginners",
        uploadedAt: "2023-11-10T10:30:00Z",
    },
    {
        id: "2",
        name: "TypeScript Basics.pdf",
        type: "document",
        size: 5242880,
        url: "https://example.com/typescript-basics.pdf",
        thumbnailUrl: "/thumbnail-2.jpg",
        tags: ["typescript", "basics"],
        folder: "Advanced TypeScript",
        uploadedAt: "2023-11-08T14:20:00Z",
    },
    {
        id: "3",
        name: "UI Design Principles.fig",
        type: "other",
        size: 15728640,
        url: "https://example.com/ui-design.fig",
        thumbnailUrl: "/thumbnail-3.jpg",
        tags: ["design", "ui", "figma"],
        folder: "UI/UX Design Fundamentals",
        uploadedAt: "2023-11-05T09:15:00Z",
    },
    {
        id: "4",
        name: "Course Resources.zip",
        type: "zip",
        size: 10485760,
        url: "https://example.com/course-resources.zip",
        thumbnailUrl: "/thumbnail-4.jpg",
        tags: ["resources", "materials"],
        folder: "React for Beginners",
        uploadedAt: "2023-11-12T11:30:00Z",
    },
]

const mockFolders = [
    { id: "1", name: "React for Beginners" },
    { id: "2", name: "Advanced TypeScript" },
    { id: "3", name: "UI/UX Design" },
    { id: "4", name: "General Resources" },
]

export const LibraryTab = () => {
    const [search, setSearch] = useState("")
    const [selectedAssets, setSelectedAssets] = useState<string[]>([])
    const [filterType, setFilterType] = useState("all")
    const [selectedFolder, setSelectedFolder] = useState("all")

    const filteredAssets = mockAssets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

        const matchesFilter = filterType === "all" || asset.type === filterType

        const matchesFolder = selectedFolder === "all" || asset.folder === selectedFolder

        return matchesSearch && matchesFilter && matchesFolder
    })

    const handleSelectAsset = (assetId: string) => {
        setSelectedAssets(prev =>
            prev.includes(assetId)
                ? prev.filter(id => id !== assetId)
                : [...prev, assetId]
        )
    }

    const handleDeleteAsset = async (assetId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            setSelectedAssets(prev => prev.filter(id => id !== assetId))
        } catch (error) {
            console.error("Error deleting asset:", error)
        }
    }

    const handleDownloadAsset = (assetUrl: string, assetName: string) => {
        const link = document.createElement('a')
        link.href = assetUrl
        link.download = assetName
        link.click()
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-5 h-5" />
            case 'image':
                return <FileText className="w-5 h-5" />
            case 'document':
                return <FileText className="w-5 h-5" />
            case 'audio':
                return <FileText className="w-5 h-5" />
            case 'zip':
                return <FileText className="w-5 h-5" />
            default:
                return <FileText className="w-5 h-5" />
        }
    }

    const getFileTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'text-blue-600'
            case 'image':
                return 'text-green-600'
            case 'document':
                return 'text-orange-600'
            case 'audio':
                return 'text-purple-600'
            case 'zip':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Content Library</h2>
                <div className="flex gap-2">
                    <Button className="bg-[#0080ff] hover:bg-[#0066cc]">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Asset
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search assets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="zip">Archives</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by folder" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Folders</SelectItem>
                        {mockFolders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.name}>{folder.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Empty State */}
            {filteredAssets.length === 0 ? (
                <Card className="bg-white shadow-sm p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <FolderOpen className="h-16 w-16 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No assets yet</h3>
                        <p className="text-gray-600">Upload your first asset to get started.</p>
                        <Button className="bg-[#0080ff] hover:bg-[#0066cc]">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Asset
                        </Button>
                    </motion.div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAssets.map((asset, index) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Card className="bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video bg-gray-200 relative">
                                    {asset.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <Video className="w-8 h-8 text-gray-400" />
                                        </div>
                                    ) : asset.type === 'image' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            {getFileIcon(asset.type)}
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-white/90 text-xs">
                                            {asset.type.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-1 truncate">{asset.name}</h3>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span className={getFileTypeColor(asset.type)}>
                                            {formatFileSize(asset.size)}
                                        </span>
                                        <span>{formatDate(asset.uploadedAt)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {asset.tags?.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadAsset(asset.url, asset.name)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSelectAsset(asset.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleDownloadAsset(asset.url, asset.name)}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => console.log("Copy asset URL:", asset.url)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy URL
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}