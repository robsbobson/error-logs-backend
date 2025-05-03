# Backend Structure

Below is the structure of the modules that make up the backend.

```xml
<backend>
    <init>Initialization and application startup</init>
    <db>Dedicated database for the backend</db>
    <model>Shared by all modules, the definition of types and data structures</model>
    <auth>Authentication and authorization</auth>
    <user>User and role management</user>
    <sync>
        <production>Process of synchronization with the production database</production>
        <firebase>Process of data synchronization with Firebase</firebase>
    </sync>
    <fetch>Fetching data by the frontend from the backend</fetch>
</backend>
```
