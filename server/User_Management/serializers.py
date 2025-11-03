from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password ,check_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=True)
    class Meta:
            model = User
            fields = ('username', 'email','first_name','last_name', 'password')
            extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
            if User.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError('A user with that email ID already exists')
            return value

    def validate_password(self, value):
            validate_password(value)
            return value

    def create(self, validated_data):
            
 
            validated_data['password'] = make_password(validated_data['password'])
            user = User(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name = validated_data.get('first_name',''),
                last_name = validated_data.get('last_name',''),
                password = validated_data['password'],

                
                
            )
            user.save()
            return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password  = serializers.CharField(write_only = True)
    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:

            try:
                user_obj = User.objects.get(email = data['email'])
                print(user_obj)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid email")

            if not check_password(data['password'],user_obj.password):
                raise serializers.ValidationError("oh Incorrect password")

            if not user_obj.is_active:
                raise serializers.ValidationError("user account is disabled")

            data['user'] = user_obj
            return data

        raise serializers.ValidationError("Both email and password are required.")





class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username','email','first_name','last_name','date_joined')