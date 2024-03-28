echo "Switching to branch master"
git checkout main

echo "Building app..."
npm run build

echo "deploying files to server"
scp -r dist/* ted@parkinglotchronicles.com:/var/www/parkinglotchronciles.com/

echo "Done"