import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { addBookmark,removeBookmark } from '../store/bookmarksSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';


export default function JobDetailsScreen() {
  const route = useRoute();
  const { job } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const bookmarks = useSelector(state => state.bookmarks.bookmarkedJobs);
  const isBookmarked = bookmarks.some((item) => item.id === job.id);

  const toastConfig = {
    success: ({ text1, text2, props }) => (
      <View style={styles.toastSuccess}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {/* <Text style={styles.toastMessage}>{text2}</Text> */}
      </View>
    ),
    info: ({ text1, text2 }) => (
      <View style={styles.toastInfo}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {/* <Text style={styles.toastMessage}>{text2}</Text> */}
      </View>
    ),
  };

  const handleBookmark = () => {
    const isBookmarked = bookmarks.some((item) => item.id === job.id);
  
    if (isBookmarked) {
      dispatch(removeBookmark(job));
      Toast.show({
        type: 'info',
        text1: 'Bookmark Removed Successfully',
        visibilityTime: 1200,
      });
    } else {
      dispatch(addBookmark(job));
      Toast.show({
        type: 'success',
        text1: 'Bookmark Added Successfully',
        visibilityTime: 1200,
      });
    }
  
    // setTimeout(() => navigation.goBack(), 1200);
  };
  

  const handleJoinWhatsApp = () => {
    if (job.contact_preference.whatsapp_link) {
      Linking.openURL(job.contact_preference.whatsapp_link);
    } else {
      Toast.show({
        type: 'error',
        text1: 'WhatsApp Link Not Available',
        text2: 'No valid WhatsApp group link provided.',
        visibilityTime: 1500,
      });
    }
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ No job details found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <Image source={{ uri: job.creatives[0].file || 'https://via.placeholder.com/400' }} style={styles.image} />
        <Text style={styles.title}>{job.title}</Text>
        {/* <Text style={styles.company}>{job.company_name === "" ? 'N/A' : job.company_name}</Text> */}
        <View style={styles.cdetails}>
          <FontAwesome name="building" size={16} color="#2557a7" style={{ marginRight: 8 }} />
          <Text style={styles.company}>{job.company_name === "" ? 'N/A' : job.company_name}</Text>
        </View>
        <View style={styles.details}>
          <FontAwesome name="map-marker" size={20} color="grey" style={{ marginRight: 8 }} />
          <Text style={styles.lvalue}>{job.primary_details?.Place || 'N/A'}</Text>
        </View>


 
        <View style={styles.divider}>
  <Text> </Text> 
</View>

        <Text style={styles.about}>About the job</Text>

        <Text style={styles.jobId}>Job ID: {job.id}</Text>




        <View style={styles.details}>
          <FontAwesome name="suitcase" size={18} color="grey" style={{ marginRight: 8 }} />
          <Text style={styles.label}> Job Role </Text>
          <Text style={styles.value}>{job.job_role === "" ? 'N/A' : job.job_role}</Text>
        </View>

        <View style={styles.details}>
          <FontAwesome name="inr" size={18} color="grey" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Salary</Text>
          <Text style={styles.value}>{job.primary_details?.Salary === "-" ? 'Not Disclosed' : job.primary_details?.Salary}</Text>
        </View>

        <View style={styles.details}>
          <FontAwesome name="id-card" size={18} color="grey" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.value}>{job.primary_details?.Experience === "-" ? 'Not Disclosed' : job.primary_details?.Experience}</Text>
        </View>


        <View style={styles.divider}>
  <Text> </Text> 
</View>


        <Text style={styles.about}>Job tags</Text>

        <View style={styles.tagsContainer}>
          {job.job_tags?.map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: tag.bg_color }]}
            >
              <Text style={[styles.tagText, { color: tag.text_color }]}>
                {tag.value}
              </Text>
            </View>
          ))}
        </View>


      </ScrollView>

      <View style={styles.buttonContainer}>
  {/* WhatsApp Button */}
  <TouchableOpacity style={styles.whatsappButton} onPress={handleJoinWhatsApp}>
  <FontAwesome name="whatsapp" size={22} color="white" style={{ marginRight: 5 }} />
    <Text style={styles.whatsappText}>Join Group</Text>
  </TouchableOpacity>

  {/* <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
  <FontAwesome name="bookmark" size={20} color="white" style={{ marginRight: 5 }} />
    <Text style={styles.buttonText}> Save</Text>
  </TouchableOpacity> */}

<TouchableOpacity
      style={[
        styles.bookmarkButton,
        { backgroundColor: isBookmarked ? '#085fbd' : '#035ec0' } // Red if saved, Blue if not
      ]}
      onPress={handleBookmark}
    >
      <FontAwesome name={isBookmarked ? 'remove' : 'bookmark'} size={20} color="white" style={{ marginRight: 5 }} />
      <Text style={styles.buttonText}>{isBookmarked ? 'Unsave' : 'Save'}</Text>
    </TouchableOpacity>
</View>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'flex-start',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  jobId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2557a7',
    marginBottom: 15,
  },
  about: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  cdetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5,
  },
  company: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2557a7'
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#e4f7e6',
    borderRadius: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    color: '#1f662c',
  },
  lvalue: {
    fontSize: 16,
    color: 'grey',
  },
  whatsappText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',  // Light gray line
    marginVertical: 18,       // Space above and below
    width: '100%',            // Full width
  },

  toastSuccess: {
    backgroundColor: '#4CAF50', // Green for success
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 0,
  },
  toastInfo: {
    backgroundColor: '#d9534f', // Green for success
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 0,
  },
  toastError: {
    backgroundColor: '#D32F2F', // Red for errors
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  toastMessage: {
    fontSize: 14,
    color: '#eee',
    marginTop: 3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom:50
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: 'bold',
  }, buttonContainer: {
    flexDirection: 'row', // Aligns buttons in a row
    justifyContent: 'space-between', // Spaces them evenly
    alignItems: 'center', // Centers buttons vertically
    paddingHorizontal: 20, // Adds spacing on both sides
    paddingVertical: 10, // Adds spacing above and below
  },
  whatsappButton: {
    flex: 1, // Makes buttons take equal space
    flexDirection:'row',
    gap:5,
    backgroundColor: '#25D366', // WhatsApp Green
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:'center',
    marginRight: 10, // Adds spacing between buttons
  },
  bookmarkButton: {
    flex: 1, // Makes buttons take equal space
    flexDirection:'row',
    gap:5,
    backgroundColor: '#2557a7', // Blue color for Bookmark button
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent:'center',
    alignItems: 'center',
  },
});
