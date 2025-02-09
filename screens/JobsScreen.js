import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TextInput, Image } from 'react-native';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';


async function translateText(text, targetLanguage) {
  
  //const API_KEY = '';
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

  // Handle invalid values (undefined, null, empty string)
  if (!text || (typeof text !== "string" && !Array.isArray(text))) {
    console.warn("Skipping translation due to invalid text format:", text);
    return text; 
  }

  try {
    const response = await axios.post(url, {
      q: Array.isArray(text) ? text.filter(t => t) : [text], // ✅ Filter out empty values
      target: targetLanguage,
      format: "text",
    });

    // ✅ Handle array translations (e.g., job_tags)
    if (Array.isArray(text)) {
      return response.data.data.translations.map(t => t.translatedText);
    }
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation failed:", error.response?.data || error.message);
    return text; // Return original text in case of failure
  }
}



export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [translatedJobs, setTranslatedJobs] = useState([]); 
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en'); 
  const [translating, setTranslating] = useState(false); 

  

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, translatedJobs]);

  const loadJobs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const newJobs = await fetchJobs(page);
    console.log(newJobs.length+" new jobs loaded ( infinite scroll )");
    
    if (newJobs.length === 0) {
      setHasMore(false);
    } else {
      const updatedJobs = [...jobs, ...newJobs];
      setJobs(updatedJobs);
      setPage(page + 1);
      translateJobs(updatedJobs, language); 
    }
    
    setLoading(false);
    setInitialLoading(false);
  };

  const translateJobs = async (jobsList, targetLanguage) => {
    if (targetLanguage === 'en') {
      setTranslatedJobs(jobsList); 
      return;
    }
    setTranslating(true); 
    const translatedData = await Promise.all(
      jobsList.map(async (job) => ({
        ...job,
        title: await translateText(job.title, targetLanguage),
        company_name: await translateText(job.company_name, targetLanguage),
        primary_details: {
          ...job.primary_details,
          Place: await translateText(job.primary_details?.Place, targetLanguage),
          Experience: await translateText(job.primary_details?.Experience, targetLanguage),
        },
        job_role: await translateText(job.job_role, targetLanguage),
      }))
    );

    setTranslatedJobs(translatedData);
    setTranslating(false);
  };

  const handleLanguageChange = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    translateJobs(jobs, selectedLanguage);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredJobs(translatedJobs);
    } else {
      const filtered = translatedJobs.filter(job => 
        (job.title?.toLowerCase() ?? "").includes(query.trim().toLowerCase()) ||
        (job.primary_details?.Place?.toLowerCase() ?? "").includes(query.trim().toLowerCase())
      );

      setFilteredJobs(filtered);
    }
  };

  if (initialLoading ) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="grey" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search by job title or location"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

      
        <View style={styles.pickerContainer}>
     
        {translating ? (
        <ActivityIndicator size={30} color="#085fbd" style={styles.langicon} />
      ) : (
      
        <Ionicons name="language" size={35} color="#085fbd" style={styles.langicon} />
      )}
        <Picker
          selectedValue={language}
          style={styles.languageSelector}
          onValueChange={(itemValue) => handleLanguageChange(itemValue)}
        >
          <Picker.Item label="Eng" value="en" />
          <Picker.Item label="हिन्दी" value="hi" />
          <Picker.Item label="తెలుగు" value="te" />
          <Picker.Item label="ಕನ್ನಡ" value="kn" />
        </Picker>
        </View>
      </View>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <View style={styles.noJobsContainer}>
          <Image source={require('./err.png')} style={styles.errorImage} />
          <Text style={styles.noJobsText}>No jobs found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs.filter(item => item.id)}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => navigation.navigate('JobDetails', { job: item })} />
          )}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadJobs}
          onEndReachedThreshold={1}
          ListFooterComponent={(loading || translating) ? <ActivityIndicator size="large" /> : !hasMore && <Text></Text>}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchBar: {
    flex: 1,
    borderColor: 'gray',
    backgroundColor: '#f2f2f2',
    height: 50,
  },
  pickerContainer: {
    width:50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginLeft: 10,
    
  },
  languageSelector: {
    height: 50,
    width: 120,
    borderRadius:50,
    backgroundColor:'green',
    marginLeft:-10,
    opacity: 0, 
  },
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  langicon:{
    position:'absolute',
    left: 8, 
    top:6
  },
  errorImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});




