import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import BookmarkCard from '../components/BookmarkCard';
import JobCard from '../components/JobCard';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function BookmarksScreen() {
  const bookmarks = useSelector(state => state.bookmarks.bookmarkedJobs);
  const navigation = useNavigation(); // Get navigation object
  return (
    <View>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) =>  <JobCard job={item} onPress={() => navigation.navigate('Jobs', { screen: 'JobDetails', params: { job: item } })} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}