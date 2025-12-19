"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipForward } from "lucide-react"
import type { CourseVideo } from "@/types/course"

interface VideoPlayerProps {
  video: CourseVideo
  onVideoEnd?: () => void
  onProgress?: (progress: number) => void
  className?: string
}

export function VideoPlayer({ video, onVideoEnd, onProgress, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onVideoEnd?.()
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleEnded)
    }
  }, [onVideoEnd])

  useEffect(() => {
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100
      onProgress?.(progressPercent)
    }
  }, [currentTime, duration, onProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, duration)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={video.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress
              value={(currentTime / duration) * 100}
              className="h-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = ((e.clientX - rect.left) / rect.width) * 100
                handleSeek([percent])
              }}
            />
            <div className="flex justify-between text-xs text-white">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={skipBackward} className="text-white hover:bg-white/20">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={skipForward} className="text-white hover:bg-white/20">
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-20">
                  <Progress
                    value={isMuted ? 0 : volume * 100}
                    className="h-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const percent = ((e.clientX - rect.left) / rect.width) * 100
                      handleVolumeChange([percent])
                    }}
                  />
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-4"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  )
}
