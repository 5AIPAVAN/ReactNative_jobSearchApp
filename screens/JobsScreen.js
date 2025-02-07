// screens/JobsScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Track first-time loading

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newJobs = await fetchJobs(page);
    if (newJobs.length === 0) {
        setHasMore(false);
      } else{
        console.log(newJobs.length);
        console.log("newwwwwwwwwwJobwwwwwwwwwwwwwwwwwwwwwwwwwws");
        setJobs([...jobs, ...newJobs]);
        console.log("newwwwwwwwwwJobs");
       setPage(page + 1);
      }

    setLoading(false);
    setInitialLoading(false); // Hide initial loading once data is fetched
  };

  // Show centered loader while fetching initial data
  if (initialLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
  data={jobs.filter(item => item.id)} // Remove items without an id
  renderItem={({ item }) => (
    <JobCard job={item} onPress={() => navigation.navigate('JobDetails', { job: item })} />
  )}
  keyExtractor={(item) => item.id.toString()}
  onEndReached={loadJobs}
  onEndReachedThreshold={0.9}
ListFooterComponent={loading ? <ActivityIndicator size="large" /> : !hasMore && <Text></Text>}
/>

    </View>
  );
}


// Styles for centering the loader
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
