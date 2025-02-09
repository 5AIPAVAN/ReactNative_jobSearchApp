import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground,StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function JobCard({ job, onPress }) {

  
// Function to calculate "X days ago"
const getDaysAgo = (updatedDate) => {
  const updatedOn = new Date(updatedDate).getTime(); 
  const now = new Date().getTime(); 
  const diffInMs = now - updatedOn; 
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); 
  return diffInDays === 0 ? "Today" : diffInDays % 10 === 0 ? "Active recently" : ` Active ${diffInDays%10} days ago`;
};

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}  activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{job.title}</Text>
        
        
        <View style={styles.details}>
          <FontAwesome name="map-marker" size={14} color="grey" style={{ marginRight: 6 }} />
          <Text style={styles.lvalue}>{job.primary_details?.Place || 'N/A'}</Text>
        </View>

        <View style={styles.jdetails}>

        <View style={styles.details}>
          <Text style={styles.svalue}>{job.primary_details?.Salary==="-"?'₹ Not Disclosed':job.primary_details?.Salary}</Text>
        </View>

        <View style={styles.pdetails}>
        <FontAwesome name="phone" size={16} color="#4261a2" style={{ marginRight: 5 }} />
          <Text style={styles.pvalue}>{job.whatsapp_no || 'N/A'}</Text>
        </View>

        </View>


      </View>

      <Text style={styles.postedText}>{getDaysAgo(job.updated_on)}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
   backgroundColor: '#fff',  
    borderRadius: 10,        
    padding: 15,              
    marginVertical: 10,        
    marginHorizontal: 20,     
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,        
    shadowRadius: 5,
    elevation: 3,             
  },
  cardContent: {
    alignItems: 'flex-start',  // Align text to the left
  },
  company:{
    fontSize: 16,   
    color: 'grey'
  },
  title: {
    fontSize: 18,           
    fontWeight: 'bold',       
   // color: '#333',        
    color:'#444a4a',    
    marginBottom: 5,          
  },
  id: {
    fontSize: 14,             
    color: '#666',
    marginBottom:10           
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pdetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 16,
    color: '#4261a2',
    backgroundColor:'#e8f3fc',
    fontWeight: 'bold',
    borderRadius:5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  jdetails: {
    flexDirection: 'row',
    gap:5,
    flexWrap:'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    color: '#007bff',
  },
  svalue: {
    color: '#1f662c',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor:'#e4f7e6',
    borderRadius:5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  lvalue: {
    fontSize: 14,
    color: 'grey',
  },
  postedText:{
    color: 'grey'
  },
  pvalue: {
    fontSize: 16,
    color: '#4261a2',
    fontWeight: 'bold',
  }
  
});




