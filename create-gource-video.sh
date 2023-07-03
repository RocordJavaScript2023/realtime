#!/bin/bash
gource -1920x1080 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx
264 -preset ultrafast -pix-fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4