from PIL import Image
import os

def clean_logo(input_path, output_path, is_checkerboard=False):
    if not os.path.exists(input_path):
        print(f"Skipping {input_path}")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # If it's a white background, remove it
        if not is_checkerboard:
            # White background removal
            if r > 240 and g > 240 and b > 240:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        else:
            # Checkerboard or light gray removal
            # The Codex logo is blue/green, so we remove gray/white pixels
            if r > 200 and g > 200 and b > 200 and abs(r-g) < 20 and abs(g-b) < 20:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

clean_logo('public/claude-logo.png', 'public/claude-logo-transparent.png')
clean_logo('public/codex-logo.png', 'public/codex-logo-transparent.png', True)
clean_logo('public/antigravity-icon__full-color.png', 'public/agy-logo-transparent.png')
