from PIL import Image, ImageMath

def distance2(a, b):
	return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2])

def makeColorTransparent(image, color, thresh2=0):
	image = image.convert("RGBA")
	red, green, blue, alpha = image.split()
	image.putalpha(ImageMath.eval("""convert(((((t - d(c, (r, g, b))) >> 31) + 1) ^ 1) * a, 'L')""",
		t=thresh2, d=distance2, c=color, r=red, g=green, b=blue, a=alpha))
	return image

if __name__ == '__main__':
	import sys	
	im = Image.open(sys.argv[1])
	width, height = im.width, im.height
	im = im.resize((width * 2, height * 2), Image.ANTIALIAS)
	thresh = 200
	fn = lambda x : 255 if x > thresh else 0
	im = im.convert('L').point(fn, mode='1')
	im = makeColorTransparent(im, (255, 255, 255))
	im = im.resize((width, height), Image.ANTIALIAS)
	im.save(sys.argv[2])