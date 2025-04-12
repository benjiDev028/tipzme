import AsyncStorage from '@react-native-async-storage/async-storage';
const url = "http://192.168.2.13:8001";


const Register = async (firstname, lastname, email, phone_number, date_birth,password) => {
  try {
      const response = await fetch(url + '/identity/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              "first_name": firstname,
              "last_name": lastname,
              "phone_number": phone_number,
              "email": email,
              "password": password,
              "date_birth": date_birth
          }),
      });

      if (response.status !== 200) {
        const errorMsg = data?.detail || `Erreur HTTP: ${response.status}`;
        console.error("Erreur de connexion:", errorMsg);
        throw new Error(errorMsg);
  
        
      }
  
      // ✅ Vérifier si la réponse contient du JSON (cas 201 Created)
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn("⚠ Réponse sans JSON, mais succès confirmé.");
        data = {};
      }
  
      console.log("✅ Utilisateur créé avec succès:", data);
      AsyncStorage.setItem('user_id', data.id);
      console.log(" id de l'utilisateur:", data.id);
      return { success: true, data };

  
    } catch (error) {
      console.error("❌ Erreur inattendue:", error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  };
  
     



const updateUser = async (userId, updatedData, authToken) => {
  try {
    const response = await fetch(`${url}/identity/update_user_by_id/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      // Répondre avec un message ou les données mises à jour
      console.log("Success", "Profile updated successfully!")
      return data;
    } else {
      const error = await response.json();
      console.log("Error", error.message || "Failed to update profile.")
    }
  } catch (error) {
    console.log('Error updating user:', error);
  }
};

        
  
const GetUsers = async ()=>{
  try{
    const response = await fetch(`${url}/identity/get_all_users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
        });
        if (response.ok) {
          const data = await response.json();
        
         
          
          return data;
          } else {
            const error = await response.json();
            console.log('Error fetching users:', error);
            }
    } catch (error) {
              console.log('Error fetching users:', error);

  }
}

const GetStats = async ()=>{
  try{
    const response = await fetch(`${url}/identity/get_all_users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
        });
        if (response.ok) {
          const data = await response.json();
          const totalUsers = data.length;
          const usersInactives = data.filter(user => user.is_email_verified === false).length;
          const userGetBonusStudio = data.filter(user => user.pointstudios >= 5000).length;

          console.log('Users inactiv:', usersInactives);
          console.log('Total users:', totalUsers);
          console.log('Users get bonus studio:', userGetBonusStudio);
          
          
          return {data,totalUsers,usersInactives,userGetBonusStudio};
          } else {
            const error = await response.json();
            console.log('Error fetching users:', error);
            }
    } catch (error) {
              console.log('Error fetching users:', error);

  }
}


const GetUserById =  async (id) => {
  try {
    const response = await fetch(`${url}/identity/get_user_by_id/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(" donnees",data);
      return data;
    } else {
      const error = await response.json();
      console.log('Error fetching user:', error);
    }
  } catch (error) {
    console.log('Error fetching user:', error);
  }
}

const DeleteUserById = async(id) => {
  try{
    const response = await fetch (`${url}/identity/delete_user_by_id/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        },
        })
    
    if (response.ok) {
      console.log('User deleted successfully');
      return true;
      } else {
        const error = await response.json();
        console.log('Error deleting user:', error);
        return false;
      }
     } catch{
      console.log('Error deleting user:', error);
    }
  }


export default {Register,updateUser,GetUsers,GetStats,GetUserById,DeleteUserById};

