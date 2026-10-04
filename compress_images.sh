#!/bin/bash
cd /mnt/shared/manhvahuyen.com/themes/wedding/source/images

for img in hero.jpg photo1.jpg photo2.jpg photo3.jpg photo4.jpg photo5.jpg photo6.jpg photo7.jpg photo8.jpg invitation.jpg card1.jpg card2.jpg; do
    if [ -f "$img" ]; then
        echo "Compressing $img..."
        convert "$img" -resize "1920x1920>" -quality 80 -strip "temp_$img"
        mv "temp_$img" "$img"
        echo "Done: $img"
    fi
done

echo "All done!"
ls -lh *.jpg
