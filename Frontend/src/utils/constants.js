export const SERVICE_CATEGORIES = ['All', 'HOME', 'REPAIR', 'CLEANING', 'BEAUTY', 'OTHER'];

export const CATEGORY_LABELS = {
  HOME: 'Home',
  REPAIR: 'Repair',
  CLEANING: 'Cleaning',
  BEAUTY: 'Beauty',
  OTHER: 'Other',
};

export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export const PROVIDER_SPECIALTIES = [
  'All',
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Beauty',
  'Repair',
  'Gardening',
];

// Indian states → cities mapping (used in booking form)
export const STATE_CITIES = {
  'Tamil Nadu': [
    'Adyar','Anna Nagar','Ambattur','Ashok Nagar','Besant Nagar','Chennai Central',
    'Chromepet','Egmore','Guindy','Kodambakkam','Kolathur','Koyambedu','Madipakkam',
    'Mylapore','Navalur','Nungambakkam','OMR','Pallavaram','Perambur','Perungudi',
    'Porur','Sholinganallur','T. Nagar','Tambaram','Thiruvanmiyur','Tondiarpet',
    'Velachery','Villivakkam','Washermanpet','Coimbatore','Madurai','Tiruchirappalli',
    'Salem','Tirunelveli','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur',
    'Kanchipuram','Cuddalore','Nagercoil','Hosur',
  ],
  'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Solapur','Amravati','Kolhapur','Thane','Navi Mumbai'],
  'Karnataka': ['Bengaluru','Mysuru','Mangaluru','Hubli','Belagavi','Davangere','Ballari','Udupi','Tumkur','Shivamogga'],
  'Kerala': ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Palakkad','Alappuzha','Kannur','Kottayam','Malappuram'],
  'Telangana': ['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Ramagundam','Mahbubnagar','Nalgonda','Adilabad','Suryapet'],
  'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Tirupati','Rajahmundry','Kakinada','Kadapa','Anantapur'],
  'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Gandhinagar','Anand','Bharuch'],
  'Rajasthan': ['Jaipur','Jodhpur','Udaipur','Kota','Bikaner','Ajmer','Bhilwara','Alwar','Sikar','Bharatpur'],
  'Uttar Pradesh': ['Lucknow','Kanpur','Agra','Varanasi','Meerut','Allahabad','Bareilly','Aligarh','Moradabad','Ghaziabad'],
  'Delhi': ['New Delhi','Dwarka','Rohini','Janakpuri','Pitampura','Laxmi Nagar','Saket','Karol Bagh','Connaught Place','Noida Extension'],
  'West Bengal': ['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Baharampur','Habra','Kharagpur'],
  'Madhya Pradesh': ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Sagar','Dewas','Satna','Ratlam','Rewa'],
  'Bihar': ['Patna','Gaya','Bhagalpur','Muzaffarpur','Purnia','Darbhanga','Bihar Sharif','Arrah','Begusarai','Katihar'],
  'Punjab': ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot','Hoshiarpur','Batala','Moga'],
  'Haryana': ['Faridabad','Gurugram','Panipat','Ambala','Yamunanagar','Rohtak','Hisar','Karnal','Sonipat','Panchkula'],
  'Odisha': ['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore','Baripada','Bhadrak','Jharsuguda'],
  'Assam': ['Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon','Dhubri','Lakhimpur'],
  'Jharkhand': ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Phusro','Hazaribagh','Giridih','Ramgarh','Medininagar'],
  'Chhattisgarh': ['Raipur','Bhilai','Bilaspur','Korba','Durg','Raigarh','Rajnandgaon','Jagdalpur','Ambikapur','Chirmiri'],
  'Goa': ['Panaji','Margao','Vasco da Gama','Mapusa','Ponda'],
  'Himachal Pradesh': ['Shimla','Manali','Dharamshala','Solan','Mandi'],
  'Uttarakhand': ['Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Rishikesh'],
  'Jammu & Kashmir': ['Srinagar','Jammu','Anantnag','Baramulla','Sopore'],
  'Puducherry': ['Puducherry','Karaikal','Mahe','Yanam'],
};
