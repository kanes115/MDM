rm -rf MDM || true
git clone https://github.com/kanes115/MDM.git
cd MDM
git checkout add_test_system || true
cd -
cp -r MDM/mdmminion ./