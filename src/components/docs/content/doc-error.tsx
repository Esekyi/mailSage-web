'use client'

import { motion } from "framer-motion"
import { FileQuestion, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DocErrorProps {
  type: '404' | 'error'
  title?: string
  message?: string
}

export function DocError({
  type,
  title = type === '404' ? "Documentation Not Found" : "Unable to Load Documentation",
  message = type === '404'
    ? "The documentation page you're looking for doesn't exist or has been moved."
    : "We're having trouble loading the documentation. Please try again later."
}: DocErrorProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          className="relative mx-auto"
        >
          {type === '404' ? (
            <FileQuestion className="w-20 h-20 text-muted-foreground/50" />
          ) : (
            <AlertCircle className="w-20 h-20 text-muted-foreground/50" />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-2 -bottom-2 w-6 h-6 rounded-full bg-background border-2"
          />
        </motion.div>

        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold tracking-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-[500px]"
          >
            {message}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            asChild
            className="gap-2"
          >
            <Link href="/docs">
              <ChevronLeft className="w-4 h-4" />
              Back to Documentation
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
