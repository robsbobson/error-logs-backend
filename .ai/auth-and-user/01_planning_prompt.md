You are an expert in creating architecture and programming backend applications using TypeScript.

Your task is to design the folder structure for the user, authentication, and authorization modules.

Analyze the current project structure `<project_structure>` and project code `<project_code>`. Based on this, create recommendations and an implementation plan.

Initial assumptions:
- Use of JWT.
- Two available user roles, ADMIN and USER.
- There will be no registration option; adding users, changing user roles, and modifying permissions will be done by a user with the ADMIN role.

<project_structure>

</project_structure>

<project_code>

</project_code>

I am considering two folder structures for two separate modules.

The first considered structure in XML notation:
```xml
<project_structure>
    <user>Module and folder for user-related data and logic</user>
    <auth>Module and folder for authentication and authorization logic</auth>
</project_structure>
```

The second considered structure in XML notation:
```xml
<project_structure>
    <user>
        <auth></auth>
    </user>
</project_structure>
```

Refer to the considered structures. Create a list of recommendations and an implementation plan.
