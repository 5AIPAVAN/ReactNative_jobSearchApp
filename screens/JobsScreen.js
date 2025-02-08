// // screens/JobsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
// import JobCard from '../components/JobCard';
// import { fetchJobs } from '../services/api';

// export default function JobsScreen({ navigation }) {
//   const [jobs, setJobs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true); // Track first-time loading

//   useEffect(() => {
//     loadJobs();
//   }, []);

//   const loadJobs = async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     const newJobs = await fetchJobs(page);
//     if (newJobs.length === 0) {
//         setHasMore(false);
//       } else{
//         console.log(newJobs.length);
//         console.log("newwwwwwwwwwJobwwwwwwwwwwwwwwwwwwwwwwwwwws");
//         setJobs([...jobs, ...newJobs]);
//         console.log("newwwwwwwwwwJobs");
//        setPage(page + 1);
//       }

//     setLoading(false);
//     setInitialLoading(false); // Hide initial loading once data is fetched
//   };

//   // Show centered loader while fetching initial data
//   if (initialLoading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     );
//   }

//   return (
//     <View>
//       <FlatList
//   data={jobs.filter(item => item.id)} // Remove items without an id
//   renderItem={({ item }) => (
//     <JobCard job={item} onPress={() => navigation.navigate('JobDetails', { job: item })} />
//   )}
//   keyExtractor={(item) => item.id.toString()}
//   onEndReached={loadJobs}
//   onEndReachedThreshold={0.9}
// ListFooterComponent={loading ? <ActivityIndicator size="large" /> : !hasMore && <Text></Text>}
// />

//     </View>
//   );
// }


// // Styles for centering the loader
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });




























import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TextInput, Image } from 'react-native';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, jobs]);

  const loadJobs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newJobs = await fetchJobs(page);
    if (newJobs.length === 0) {
      setHasMore(false);
    } else {
      setJobs([...jobs, ...newJobs]);
      setPage(page + 1);
    }
    setLoading(false);
    setInitialLoading(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        (job.title?.toLowerCase() ?? "").includes(query.trim().toLowerCase()) ||
        (job.primary_details?.Place?.toLowerCase() ?? "").includes(query.trim().toLowerCase())
      );
      
      setFilteredJobs(filtered);
    }
  };


  if (initialLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
            <View style={styles.searchContainer}>
      <FontAwesome name="search" size={20} color="grey" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by job title or location"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

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
          onEndReachedThreshold={0.9}
          ListFooterComponent={loading ? <ActivityIndicator size="large" /> : !hasMore && <Text></Text>}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    borderColor: 'gray',
    backgroundColor:'#f2f2f2',
    height: 50,
  },
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  errorImage: {
    width: 150,  // Adjust size as needed
    height: 150,
    marginBottom: 10,
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});



